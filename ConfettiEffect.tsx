import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, CheckCircle2, RotateCcw, Heart, Sparkles, HelpCircle, Activity } from 'lucide-react';

interface ButterflyHugProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

export default function ButterflyHug({ onBack, logActivity }: ButterflyHugProps) {
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0); // 1 ciclo = 2 taps (izq + der)
  const [currentSide, setCurrentSide] = useState<'none' | 'left' | 'right'>('none');
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [autoSpeed, setAutoSpeed] = useState(1200); // ms entre taps en modo auto
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detener temporizadores al desmontarse
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Control del modo automático
  useEffect(() => {
    if (mode === 'auto' && isAutoRunning) {
      timerRef.current = setInterval(() => {
        setCurrentSide((prev) => {
          const next = prev === 'left' ? 'right' : 'left';
          
          // Generar el pulso auditivo paneado bilateral
          playEMDRSound(next);

          setTotalTaps((taps) => {
            const newTaps = taps + 1;
            if (newTaps % 2 === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            return newTaps;
          });

          return next;
        });
      }, autoSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isAutoRunning, autoSpeed, isMuted]);

  // Completar la sesión de Abrazo de Mariposa cuando alcanza 20 ciclos (40 aleteos)
  useEffect(() => {
    if (cyclesCompleted >= 20) {
      setIsAutoRunning(false);
      logActivity('Abraço de Borboleta');
    }
  }, [cyclesCompleted]);

  // Efecto de sonido EMDR paneado bilateralmente en auriculares
  const playEMDRSound = (side: 'left' | 'right') => {
    if (isMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = 'sine';
      // Tono suave de frecuencia baja (ideal para relajación)
      osc.frequency.setValueAtTime(side === 'left' ? 180 : 200, now);

      // Desvanecimiento suave
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      if (panner) {
        // Enviar sonido al auricular izquierdo o derecho para estimulación bilateral real
        panner.pan.setValueAtTime(side === 'left' ? -1 : 1, now);
        osc.connect(panner);
        panner.connect(gainNode);
      } else {
        osc.connect(gainNode);
      }

      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Fallo al reproducir audio EMDR:', e);
    }
  };

  // Click manual de aleteo
  const handleTap = (side: 'left' | 'right') => {
    if (mode === 'auto' || cyclesCompleted >= 20) return;

    setCurrentSide(side);
    playEMDRSound(side);

    setTotalTaps((prev) => {
      const nextTaps = prev + 1;
      if (nextTaps % 2 === 0) {
        setCyclesCompleted((c) => c + 1);
      }
      return nextTaps;
    });

    // Pequeño timeout para deseleccionar visualmente el hombro
    setTimeout(() => {
      setCurrentSide('none');
    }, 450);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleReset = () => {
    setCyclesCompleted(0);
    setTotalTaps(0);
    setCurrentSide('none');
    setIsAutoRunning(false);
  };

  const toggleAutoPlay = () => {
    if (mode === 'manual') {
      setMode('auto');
      setIsAutoRunning(true);
    } else {
      setIsAutoRunning(!isAutoRunning);
    }
  };

  if (cyclesCompleted >= 20) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-[#1e293b]">Sessão Concluída!</h2>
        <p className="text-[#1e293b] font-medium text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full inline-block mb-4 border border-emerald-200">
          🦋 Você completou 20 ciclos de estimulação bilateral
        </p>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm">
          Excelente. Ao estimular de forma rítmica e alternada ambos os lados do seu corpo, você ajudou o cérebro a diminuir o estado de alerta e a reprocessar as sensações de inquietação e tensão física.
        </p>

        <div className="w-full space-y-3">
          <button 
            onClick={handleReset}
            className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Repetir Abraço de Borboleta
          </button>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-[#1e293b] text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            Voltar ao Resgate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[75vh] animate-in fade-in">
      {/* Navigation Topbar */}
      <div className="flex justify-between items-center mb-5 relative select-none">
        <button 
          onClick={onBack}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-xs text-gray-400 uppercase tracking-widest block">EMERGÊNCIA</span>
          <span className="font-bold text-sm text-[#1e293b]">Abraço de Borboleta (EMDR)</span>
        </div>
        <button 
          onClick={handleToggleMute}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-500"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400 animate-pulse" /> : <Volume2 className="w-5 h-5 text-[#b388c4]" />}
        </button>
      </div>

      {/* Main interactive area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center py-6 relative">
        {/* Step progress tracker */}
        <div className="w-full max-w-xs mb-4 bg-gray-50 rounded-2xl p-3 border border-gray-150 flex flex-col items-center">
          <div className="flex justify-between w-full text-xs font-black text-gray-500 mb-2 select-none">
            <span>TOQUES CONCLUÍDOS</span>
            <span className="text-[#b388c4]">{cyclesCompleted} de 20</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden flex gap-0.5">
            <div 
              style={{ width: `${(cyclesCompleted / 20) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-400 via-[#b388c4] to-emerald-400 transition-all duration-500"
            />
          </div>
          <p className="text-[9px] text-gray-400 font-extrabold mt-1.5 uppercase tracking-wide">
            {cyclesCompleted < 5 
              ? '✨ Fase inicial: ancorando a atenção' 
              : cyclesCompleted < 12 
                ? '🧠 Estimulação bilateral: conectando hemisférios' 
                : '🍃 Alívio profundo: regulando seus batimentos'}
          </p>
        </div>

        {/* Toggle Info Explanation */}
        <div className="w-full max-w-xs flex justify-end mb-2">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[11px] font-black tracking-wide text-[#b388c4] bg-[#F5EFFF] px-2.5 py-1 rounded-full border border-[#b388c4]/15 hover:bg-[#ebdcf5] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" /> {showInfo ? 'Ocultar Guia' : 'O que é isso?'}
          </button>
        </div>

        {showInfo && (
          <div className="w-full max-w-xs bg-[#F5EFFF] p-4 rounded-2xl border border-[#b388c4]/20 text-xs text-gray-600 leading-relaxed mb-4 animate-in slide-in-from-top-3 duration-300">
            <p className="font-bold text-[#1e293b] mb-1">Estimulação Bilateral (EMDR)</p>
            Esta técnica ajuda o cérebro a processar a sobrevida ou sobrecarga emocional. O som direcionado e os toques rítmicos alternam a estimulação entre ambos os hemisférios cerebrais, relaxando o sistema nervoso simpático.
          </div>
        )}

        {/* Graphic & Butterfly Animation */}
        <div className="relative w-48 h-48 flex items-center justify-center my-2 select-none">
          {/* LFO pulsing wave background */}
          <div 
            className={`absolute w-32 h-32 rounded-full opacity-15 blur-2xl transition-all duration-700
              ${currentSide === 'left' ? 'bg-blue-400 left-8 scale-110' : ''}
              ${currentSide === 'right' ? 'bg-emerald-400 right-8 scale-110' : ''}
              ${currentSide === 'none' ? 'bg-[#b388c4]/40 scale-100' : ''}
            `}
          />

          {/* SVG Vector Graphic for Butterfly Hug - Arms crossed on chest */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md z-10">
            {/* Person silhouette */}
            <path d="M 15 95 C 15 70, 30 60, 50 63 C 70 60, 85 70, 85 95 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Upper torso & neck */}
            <path d="M 45 60 L 55 60 L 53 45 L 47 45 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Face/Head outline */}
            <circle cx="50" cy="35" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Hair outline & closed eyes */}
            <path d="M 37 30 Q 50 20 63 30" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <path d="M 42 36 Q 45 38 48 36" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 52 36 Q 55 38 58 36" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 47 41 Q 50 43 53 41" fill="none" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

            {/* Left Arm and Hand crossing to Right Shoulder (Point 1) */}
            <path 
              d="M 15 90 C 25 78, 45 62, 68 62" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            {/* Right Arm and Hand crossing to Left Shoulder (Point 2) */}
            <path 
              d="M 85 90 C 75 78, 55 62, 32 62" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="5" 
              strokeLinecap="round" 
            />

            {/* HAND LEFT (on right shoulder area) */}
            <g 
              onClick={() => handleTap('left')}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <ellipse 
                cx="66" 
                cy="60" 
                rx="6" 
                ry="5" 
                fill={currentSide === 'left' ? '#60a5fa' : '#cbd5e1'} 
                className="transition-colors duration-200"
              />
              <circle cx="66" cy="60" r="3" fill="white" opacity="0.8" />
              {currentSide === 'left' && (
                <circle cx="66" cy="60" r="14" fill="none" stroke="#60a5fa" strokeWidth="1.5" className="animate-ping" />
              )}
            </g>

            {/* HAND RIGHT (on left shoulder area) */}
            <g 
              onClick={() => handleTap('right')}
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
            >
              <ellipse 
                cx="34" 
                cy="60" 
                rx="6" 
                ry="5" 
                fill={currentSide === 'right' ? '#34d399' : '#cbd5e1'} 
                className="transition-colors duration-200"
              />
              <circle cx="34" cy="60" r="3" fill="white" opacity="0.8" />
              {currentSide === 'right' && (
                <circle cx="34" cy="60" r="14" fill="none" stroke="#34d399" strokeWidth="1.5" className="animate-ping" />
              )}
            </g>

            {/* Butterfly wings metaphor behind chest */}
            <path 
              d="M 50 63 Q 32 50 20 62 Q 24 74 50 64" 
              fill="none" 
              stroke={currentSide === 'right' ? '#34d399' : '#b388c4'} 
              strokeWidth="1.5" 
              opacity="0.4"
            />
            <path 
              d="M 50 63 Q 68 50 80 62 Q 76 74 50 64" 
              fill="none" 
              stroke={currentSide === 'left' ? '#60a5fa' : '#b388c4'} 
              strokeWidth="1.5" 
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Action guidelines labels */}
        <div className="text-center max-w-xs h-16 flex flex-col justify-center select-none mb-3">
          <h4 className="text-lg font-black tracking-wider text-[#1e293b] flex items-center justify-center gap-1.5 leading-none">
            {currentSide === 'left' && <span className="text-blue-500">◀ TOQUE ESQUERDO</span>}
            {currentSide === 'right' && <span className="text-emerald-500">TOQUE DIREITO ▶</span>}
            {currentSide === 'none' && <span className="text-gray-400">INICIE O RITMO</span>}
          </h4>
          <p className="text-xs text-gray-400 font-bold px-4 mt-1">
            {mode === 'manual' 
              ? 'Toque nos círculos coloridos de forma alternada no gráfico' 
              : 'Acompanhe o balanço rítmico automático de um lado para o outro'}
          </p>
        </div>

        {/* Selector de Modos (Manual / Automático) */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full max-w-xs mb-3.5 border border-gray-150">
          <button 
            onClick={() => { setMode('manual'); setIsAutoRunning(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'manual' 
                ? 'bg-[#1e293b] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modo Manual (Toque)
          </button>
          <button 
            onClick={() => { setMode('auto'); toggleAutoPlay(); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'auto' 
                ? 'bg-[#1e293b] text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modo Auto (Guiado)
          </button>
        </div>

        {/* CONTROLES EXTRAS SEGÚN EL MODO */}
        {mode === 'manual' ? (
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-1">
            <button 
              onClick={() => handleTap('left')}
              className="py-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl font-bold hover:bg-blue-100/50 transition-colors text-xs flex justify-center items-center gap-1.5 shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-current" /> Mão Esq
            </button>
            <button 
              onClick={() => handleTap('right')}
              className="py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100/50 transition-colors text-xs flex justify-center items-center gap-1.5 shadow-xs"
            >
              Mão Dir <Heart className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs flex flex-col items-center mt-1">
            {/* Botón de reproducción de metrónomo */}
            <button 
              onClick={toggleAutoPlay}
              className={`w-full py-3.5 rounded-xl text-xs font-bold shadow-sm transition-colors flex justify-center items-center gap-2 mb-3
                ${isAutoRunning ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
            >
              {isAutoRunning ? '⏸ Pausar Metrônomo' : '▶ Ativar Metrônomo'}
            </button>

            {/* Control sutil de velocidad para la estimulación EMDR */}
            <div className="w-full bg-gray-50 p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wide">Frequência / Ritmo:</span>
              <div className="flex gap-1.5">
                {[
                  { label: 'Suave', ms: 1400 },
                  { label: 'Normal', ms: 1200 },
                  { label: 'Rápido', ms: 900 }
                ].map(speed => (
                  <button
                    key={speed.ms}
                    onClick={() => setAutoSpeed(speed.ms)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      autoSpeed === speed.ms 
                        ? 'bg-[#b388c4] border-[#b388c4] text-white shadow-xs font-black' 
                        : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-150'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
