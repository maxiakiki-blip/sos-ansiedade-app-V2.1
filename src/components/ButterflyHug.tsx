import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ButterflyHugProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const TOTAL_CYCLES = 12;
const TAP_INTERVAL = 1100;

export default function ButterflyHug({ onBack, logActivity }: ButterflyHugProps) {
  const [phase, setPhase] = useState<'intro' | 'running' | 'done'>('intro');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [tapCount, setTapCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playTap = (side: 'left' | 'right') => {
    if (isMuted) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(side === 'left' ? 180 : 210, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      panner.pan.setValueAtTime(side === 'left' ? -0.9 : 0.9, ctx.currentTime);
      osc.connect(panner); panner.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveSide(prev => {
        const next = prev === 'left' ? 'right' : 'left';
        playTap(next);
        setTapCount(t => {
          const newT = t + 1;
          if (newT % 2 === 0) {
            setCyclesCompleted(c => {
              const newC = c + 1;
              if (newC >= TOTAL_CYCLES) {
                setIsRunning(false);
                setPhase('done');
                logActivity('Abraço de Borboleta');
              }
              return newC;
            });
          }
          return newT;
        });
        return next;
      });
    }, TAP_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isMuted]);

  const start = () => { setPhase('running'); setIsRunning(true); playTap('left'); };
  const reset = () => { setCyclesCompleted(0); setTapCount(0); setActiveSide('left'); setIsRunning(false); setPhase('intro'); };

  const S = { skin: '#F5C9A0', skinD: '#E8A87C', skinL: '#FAE0C8', nail: '#F9CEC3', hair: '#3D2314', lip: '#C8877A' };

  const CrossedArmsBody = ({ side }: { side?: 'left' | 'right' }) => (
    <svg viewBox="0 0 160 220" width="180" height="220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Torso / shirt */}
      <rect x="52" y="104" width="56" height="60" rx="10" fill="#e0e7ff" />
      {/* Neck */}
      <rect x="72" y="92" width="16" height="18" rx="5" fill={S.skin} />
      {/* Head */}
      <ellipse cx="80" cy="72" rx="26" ry="28" fill={S.skin} />
      {/* Hair */}
      <ellipse cx="80" cy="54" rx="26" ry="14" fill={S.hair} />
      <rect x="54" y="54" width="10" height="22" rx="5" fill={S.hair} />
      <rect x="96" y="54" width="10" height="22" rx="5" fill={S.hair} />
      {/* Ears */}
      <ellipse cx="54" cy="74" rx="5" ry="7" fill={S.skin} />
      <ellipse cx="106" cy="74" rx="5" ry="7" fill={S.skin} />
      {/* Eyes closed — peaceful */}
      <path d="M68 71 Q73 75 78 71" stroke={S.skinD} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M82 71 Q87 75 92 71" stroke={S.skinD} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Nose */}
      <path d="M78 78 Q80 82 82 78" stroke={S.skinD} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      {/* Smile */}
      <path d="M73 84 Q80 90 87 84" stroke={S.lip} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* LEFT arm going to RIGHT shoulder */}
      <path d="M60 115 Q54 108 50 100 Q46 91 56 88 Q68 85 88 90"
        stroke={S.skin} strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M60 115 Q54 108 50 100 Q46 91 56 88 Q68 85 88 90"
        stroke={S.skinD} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      {/* LEFT hand on RIGHT shoulder */}
      <ellipse cx="90" cy="91" rx="11" ry="9" fill={S.skin} />
      <ellipse cx="90" cy="88" rx="8" ry="5" fill={S.skinL} />
      {[85,88,91,94,97].map((x,i) => <line key={i} x1={x} y1="85" x2={x-1} y2="81" stroke={S.skinD} strokeWidth="1.2" strokeLinecap="round"/>)}
      {side === 'left' && <circle cx="90" cy="91" r="14" fill="#b388c4" opacity="0.22"/>}
      {/* RIGHT arm going to LEFT shoulder */}
      <path d="M100 115 Q106 108 110 100 Q114 91 104 88 Q92 85 72 90"
        stroke={S.skin} strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M100 115 Q106 108 110 100 Q114 91 104 88 Q92 85 72 90"
        stroke={S.skinD} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
      {/* RIGHT hand on LEFT shoulder */}
      <ellipse cx="70" cy="91" rx="11" ry="9" fill={S.skin} />
      <ellipse cx="70" cy="88" rx="8" ry="5" fill={S.skinL} />
      {[65,68,71,74,77].map((x,i) => <line key={i} x1={x} y1="85" x2={x-1} y2="81" stroke={S.skinD} strokeWidth="1.2" strokeLinecap="round"/>)}
      {side === 'right' && <circle cx="70" cy="91" r="14" fill="#60a5fa" opacity="0.22"/>}
      {/* Lower body */}
      <rect x="60" y="158" width="14" height="50" rx="7" fill="#cbd5e1" />
      <rect x="86" y="158" width="14" height="50" rx="7" fill="#cbd5e1" />
      {/* Butterfly wings (decorative) */}
      <path d="M80 130 Q55 115 44 128 Q49 145 80 137" fill="#b388c4" opacity="0.07"/>
      <path d="M80 130 Q105 115 116 128 Q111 145 80 137" fill="#60a5fa" opacity="0.07"/>
    </svg>
  );

  if (phase === 'intro') {
    return (
      <div className="flex flex-col h-full pb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="text-center">
            <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">EMERGÊNCIA</span>
            <span className="font-bold text-sm text-[#1e293b]">Abraço de Borboleta</span>
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#b388c4]" />}
          </button>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center justify-between">
          <div className="flex flex-col items-center">
            <p className="text-[11px] font-black text-[#b388c4] uppercase tracking-widest mb-3">Como se faz</p>
            <h2 className="text-xl font-black text-[#1e293b] text-center mb-4">Cruce os braços sobre o peito</h2>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }} className="mb-5">
              <CrossedArmsBody />
            </motion.div>
            <div className="w-full space-y-3 max-w-xs">
              {[
                { n: '1', text: 'Cruce o braço esquerdo sobre o peito, mão no ombro direito' },
                { n: '2', text: 'Cruce o braço direito por cima, mão no ombro esquerdo' },
                { n: '3', text: 'O app vai guiar o ritmo — apenas siga tocando alternado' },
              ].map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>{s.n}</div>
                  <p className="text-sm text-gray-500 leading-snug">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.button onClick={start} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 mt-6"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)', boxShadow: '0 8px 24px rgba(179,136,196,0.4)' }}>
            <Play className="w-5 h-5 fill-current" /> Estou pronto — Começar
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
        <motion.div className="text-6xl mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}>🦋</motion.div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Sessão Concluída!</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1.5 rounded-full border border-purple-200">🦋 {TOTAL_CYCLES} ciclos bilaterais</span>
          <span className="bg-[#F5EFFF] text-[#b388c4] text-xs font-black px-3 py-1.5 rounded-full border border-[#b388c4]/20">+35 XP</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">A estimulação rítmica alternada ajudou seu cérebro a processar a tensão e reduzir o estado de alerta.</p>
        <div className="w-full space-y-3">
          <motion.button onClick={reset} whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir
          </motion.button>
          <motion.button onClick={onBack} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>Voltar ao Resgate</motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">EMERGÊNCIA</span>
          <span className="font-bold text-sm text-[#1e293b]">Abraço de Borboleta</span>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#b388c4]" />}
        </button>
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center py-6">
        <div className="w-full max-w-xs mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ciclos</span>
            <AnimatePresence mode="wait">
              <motion.span key={cyclesCompleted}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className="text-xl font-black tabular-nums" style={{ color: '#b388c4' }}>
                {cyclesCompleted}<span className="text-sm text-gray-300 font-bold"> / {TOTAL_CYCLES}</span>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div key={i} className="w-6 h-6 rounded-full flex items-center justify-center"
                animate={cyclesCompleted > i ? { backgroundColor: '#b388c4', scale: 1 } : cyclesCompleted === i ? { backgroundColor: '#f3e8ff', scale: 1.2 } : { backgroundColor: '#f1f5f9', scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                {cyclesCompleted > i && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center mb-2">
          <CrossedArmsBody side={activeSide} />
          <AnimatePresence>
            <motion.div key={activeSide} className="absolute rounded-full pointer-events-none"
              style={{ width: 32, height: 32, background: activeSide === 'left' ? '#b388c4' : '#60a5fa',
                left: activeSide === 'left' ? '53%' : '36%', top: '33%', transform: 'translate(-50%,-50%)' }}
              initial={{ opacity: 0.7, scale: 0.5 }} animate={{ opacity: 0, scale: 2.5 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }} />
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeSide}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-black uppercase tracking-widest mb-5"
            style={{ color: activeSide === 'left' ? '#b388c4' : '#60a5fa' }}>
            {activeSide === 'left' ? '← Ombro direito' : 'Ombro esquerdo →'}
          </motion.div>
        </AnimatePresence>
        <motion.button onClick={() => setIsRunning(r => !r)} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold text-sm"
          style={{ borderColor: isRunning ? '#e5e7eb' : '#b388c4', color: isRunning ? '#94a3b8' : '#b388c4', backgroundColor: isRunning ? '#f8fafc' : '#faf5ff' }}>
          {isRunning ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4 fill-current" /> Continuar</>}
        </motion.button>
      </div>
    </div>
  );
        }
