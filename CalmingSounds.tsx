import React, { useState, useEffect, useRef } from 'react';
import { Wind, Volume2, VolumeX, ArrowLeft, CheckCircle2, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface BreathingExerciseProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
  onComplete: () => void;
}

type BreathingPhase = 'inhale' | 'hold_full' | 'exhale' | 'hold_empty';

const PHASE_CONFIG = {
  inhale:     { title: 'INSPIRAR',  subtitle: 'Inspire suave e continuamente',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  scale: 1.35, label: 'bg-blue-400'   },
  hold_full:  { title: 'SEGURAR',   subtitle: 'Segure com os pulmões cheios',     color: '#10b981', bg: 'rgba(16,185,129,0.12)', scale: 1.25, label: 'bg-emerald-400' },
  exhale:     { title: 'EXPIRAR',   subtitle: 'Solte lentamente pela boca',       color: '#b388c4', bg: 'rgba(179,136,196,0.12)', scale: 0.85, label: 'bg-purple-400'  },
  hold_empty: { title: 'RETER',     subtitle: 'Fique sem ar em vazio absoluto',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', scale: 0.7,  label: 'bg-amber-400'   },
};

export default function BreathingExercise({ onBack, logActivity, onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopOscillator = () => {
    try { oscRef.current?.stop(); } catch {}
    try { oscRef.current?.disconnect(); } catch {}
    try { gainRef.current?.disconnect(); } catch {}
    oscRef.current = null;
    gainRef.current = null;
  };

  useEffect(() => {
    if (!isRunning || isMuted || cyclesCompleted >= 4) { stopOscillator(); return; }
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      stopOscillator();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.type = 'sine';
      if (phase === 'inhale') {
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 4);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 1);
        gain.gain.linearRampToValueAtTime(0, now + 4);
      } else if (phase === 'exhale') {
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 4);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 1);
        gain.gain.linearRampToValueAtTime(0, now + 4);
      } else {
        osc.frequency.setValueAtTime(160, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.5);
        gain.gain.linearRampToValueAtTime(0.03, now + 3.5);
        gain.gain.linearRampToValueAtTime(0, now + 4);
      }
      osc.start(now);
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {}
    return () => { stopOscillator(); };
  }, [phase, isMuted, isRunning, cyclesCompleted]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);
    return () => { clearInterval(interval); stopOscillator(); };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setPhase(curr => {
        switch (curr) {
          case 'inhale':     return 'hold_full';
          case 'hold_full':  return 'exhale';
          case 'exhale':     return 'hold_empty';
          case 'hold_empty': setCyclesCompleted(p => p + 1); return 'inhale';
          default:           return 'inhale';
        }
      });
      setSecondsLeft(4);
    }
  }, [secondsLeft]);

  useEffect(() => {
    if (cyclesCompleted >= 4) logActivity('Respiração Tática');
  }, [cyclesCompleted]);

  const cfg = PHASE_CONFIG[phase];

  if (cyclesCompleted >= 4) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6 animate-in zoom-in duration-300">
        <style>{`@keyframes trophy-bounce { 0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)} } .trophy-anim{animation:trophy-bounce 1.5s ease-in-out infinite}`}</style>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg trophy-anim"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-[#1e293b]">Sessão Concluída!</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-200">🎯 {cyclesCompleted} ciclos perfeitos</span>
          <span className="bg-[#F5EFFF] text-[#b388c4] text-xs font-black px-3 py-1.5 rounded-full border border-[#b388c4]/20">+30 XP</span>
        </div>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm">
          Você regulou seu pulso de forma maravilhosa. O estado de agitação diminuiu visivelmente. O que deseja fazer agora?
        </p>
        <div className="w-full space-y-3">
          <button onClick={onComplete}
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
            Próximo: Conexão Sensorial 5-4-3-2-1 <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => { setCyclesCompleted(0); setPhase('inhale'); setSecondsLeft(4); setIsRunning(true); }}
            className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir Respiração
          </button>
          <button onClick={onBack}
            className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-bold hover:bg-black transition-colors">
            Voltar ao Painel
          </button>
        </div>
      </div>
    );
  }

  const orbScale = cfg.scale;
  const ringProgress = ((5 - secondsLeft) / 4) * 100;
  const circumference = 282.7;
  const strokeDashoffset = circumference - (circumference * ringProgress) / 100;

  return (
    <div className="animate-in fade-in h-full flex flex-col justify-between pb-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">EMERGÊNCIA</span>
          <span className="font-bold text-sm text-[#1e293b]">Respiração Tática</span>
        </div>
        <button onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50">
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#b388c4]" />}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center py-8">
        {/* Cycle progress */}
        <div className="w-full max-w-xs mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between text-[11px] font-black text-gray-500 mb-2">
            <span>CICLOS</span>
            <span style={{ color: cfg.color }}>{cyclesCompleted} de 4</span>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex-1 h-2 rounded-full transition-all duration-700"
                style={{ background: cyclesCompleted > i ? '#10b981' : cyclesCompleted === i ? cfg.color : '#e5e7eb' }} />
            ))}
          </div>
        </div>

        {/* Breathing sphere */}
        <div className="relative w-60 h-60 flex items-center justify-center mb-6">
          {/* SVG ring */}
          <svg className="absolute w-56 h-56 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="none"
              stroke={cfg.color} strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round" />
          </svg>

          {/* Background glow orb */}
          <div className="absolute w-48 h-48 rounded-full transition-all duration-[4000ms] ease-in-out pointer-events-none blur-xl"
            style={{ background: cfg.bg, transform: `scale(${orbScale})` }} />

          {/* Core bubble - uses inline style for smooth scale animation */}
          <button onClick={() => setIsRunning(!isRunning)}
            className="relative flex flex-col items-center justify-center text-white rounded-full shadow-2xl border-4 border-white transition-all duration-[4000ms] ease-in-out cursor-pointer"
            style={{
              width: '144px', height: '144px',
              transform: `scale(${orbScale})`,
              background: `radial-gradient(circle at 35% 35%, ${cfg.color}cc, ${cfg.color})`,
              boxShadow: `0 8px 32px ${cfg.color}60`,
            }}>
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3), transparent 60%)' }} />
            <Wind className="w-8 h-8 mb-1 relative z-10" />
            <span className="text-4xl font-black tabular-nums leading-none relative z-10">{secondsLeft}</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1 relative z-10">seg</span>
          </button>
        </div>

        {/* Phase label */}
        <div className="text-center mb-6">
          <h4 className="text-2xl font-black tracking-widest mb-1 transition-all duration-500" style={{ color: cfg.color }}>
            {cfg.title}
          </h4>
          <p className="text-xs text-gray-500 font-semibold">{cfg.subtitle}</p>
        </div>

        {/* Step indicators */}
        <div className="w-full max-w-xs flex gap-2">
          {(Object.entries(PHASE_CONFIG) as [BreathingPhase, typeof PHASE_CONFIG[BreathingPhase]][]).map(([key, c]) => (
            <div key={key}
              className="flex-1 flex flex-col items-center py-2.5 rounded-xl border text-center transition-all duration-300"
              style={{
                background: phase === key ? c.color : '#f8fafc',
                borderColor: phase === key ? c.color : '#e5e7eb',
                color: phase === key ? 'white' : '#94a3b8',
                transform: phase === key ? 'scale(1.05)' : 'scale(1)',
              }}>
              <span className="text-[10px] font-black">{c.title}</span>
              <span className="text-[8px] opacity-70 mt-0.5">4 seg</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400 font-semibold">
          {isRunning ? '⏸ Toque no círculo para pausar' : '▶ Toque no círculo para continuar'}
        </p>
      </div>
    </div>
  );
}
