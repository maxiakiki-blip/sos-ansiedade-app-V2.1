import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BreathingExerciseProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
  onComplete: () => void;
}

type BreathingPhase = 'inhale' | 'hold_full' | 'exhale' | 'hold_empty';

const PHASE_CONFIG: Record<BreathingPhase, {
  title: string;
  subtitle: string;
  color: string;
  orbScale: number;
  textScale: number;
  textOpacity: number;
}> = {
  inhale: {
    title: 'INSPIRAR',
    subtitle: 'Suave e contínuo',
    color: '#3b82f6',
    orbScale: 1.35,
    textScale: 1.18,
    textOpacity: 1,
  },
  hold_full: {
    title: 'SEGURAR',
    subtitle: 'Pulmões cheios',
    color: '#10b981',
    orbScale: 1.25,
    textScale: 1.05,
    textOpacity: 1,
  },
  exhale: {
    title: 'EXPIRAR',
    subtitle: 'Solte pela boca',
    color: '#b388c4',
    orbScale: 0.85,
    textScale: 0.88,
    textOpacity: 0.85,
  },
  hold_empty: {
    title: 'RETER',
    subtitle: 'Vazio absoluto',
    color: '#f59e0b',
    orbScale: 0.72,
    textScale: 0.78,
    textOpacity: 0.7,
  },
};

const PHASES_ORDER: BreathingPhase[] = ['inhale', 'hold_full', 'exhale', 'hold_empty'];
const TOTAL_CYCLES = 4;

function playCompletionSound(audioCtx: AudioContext) {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    const start = audioCtx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
    osc.start(start);
    osc.stop(start + 0.7);
  });
}

export default function BreathingExercise({ onBack, logActivity, onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [done, setDone] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const stopOscillator = () => {
    try { oscRef.current?.stop(); } catch {}
    try { oscRef.current?.disconnect(); } catch {}
    try { gainRef.current?.disconnect(); } catch {}
    oscRef.current = null;
    gainRef.current = null;
  };

  useEffect(() => {
    if (!isRunning || isMuted || done) { stopOscillator(); return; }
    try {
      const ctx = getAudioCtx();
      stopOscillator();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
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
  }, [phase, isMuted, isRunning, done]);

  useEffect(() => {
    if (!isRunning || done) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, done]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    const currentIndex = PHASES_ORDER.indexOf(phase);
    const nextPhase = PHASES_ORDER[(currentIndex + 1) % 4];

    if (phase === 'hold_empty') {
      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);
      if (newCycles >= TOTAL_CYCLES) {
        stopOscillator();
        setDone(true);
        logActivity('Respiração Tática');
        if (!isMuted) {
          try { playCompletionSound(getAudioCtx()); } catch {}
        }
        return;
      }
    }

    setPhase(nextPhase);
    setSecondsLeft(4);
  }, [secondsLeft]);

  const cfg = PHASE_CONFIG[phase];

  if (done) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <style>{`@keyframes trophy-bounce{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)}}.trophy-anim{animation:trophy-bounce 1.5s ease-in-out infinite}`}</style>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg trophy-anim"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-[#1e293b]">Sessão Concluída!</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-200">🎯 {TOTAL_CYCLES} ciclos perfeitos</span>
          <span className="bg-[#F5EFFF] text-[#b388c4] text-xs font-black px-3 py-1.5 rounded-full border border-[#b388c4]/20">+30 XP</span>
        </div>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-sm">
          Você regulou seu pulso de forma maravilhosa. O estado de agitação diminuiu visivelmente.
        </p>
        <div className="w-full space-y-3">
          <motion.button onClick={onComplete} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
            Próximo: Conexão Sensorial 5-4-3-2-1 <ChevronRight className="w-5 h-5" />
          </motion.button>
          <button onClick={() => { setCyclesCompleted(0); setPhase('inhale'); setSecondsLeft(4); setIsRunning(true); setDone(false); }}
            className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir
          </button>
          <button onClick={onBack} className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-bold">
            Voltar ao Painel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">EMERGÊNCIA</span>
          <span className="font-bold text-sm text-[#1e293b]">Respiração Tática</span>
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#b388c4]" />}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center py-8">

        {/* Cycle counter */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ciclos</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={cyclesCompleted}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className="text-2xl font-black tabular-nums"
                style={{ color: cfg.color }}
              >
                {cyclesCompleted}<span className="text-sm text-gray-300 font-bold"> / {TOTAL_CYCLES}</span>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div
                key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 font-black text-sm"
                animate={
                  cyclesCompleted > i
                    ? { background: '#10b981', borderColor: '#10b981', color: '#fff', scale: 1 }
                    : cyclesCompleted === i
                    ? { background: cfg.color + '22', borderColor: cfg.color, color: cfg.color, scale: 1.1 }
                    : { background: '#f8fafc', borderColor: '#e5e7eb', color: '#cbd5e1', scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {cyclesCompleted > i ? '✓' : i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Breathing orb — no ring, text inside */}
        <div className="relative flex items-center justify-center mb-8" style={{ width: 240, height: 240 }}>

          {/* Soft glow behind orb */}
          <motion.div
            className="absolute rounded-full blur-2xl pointer-events-none"
            animate={{
              width: `${cfg.orbScale * 180}px`,
              height: `${cfg.orbScale * 180}px`,
              background: cfg.color + '28',
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
          />

          {/* Main orb button */}
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className="relative flex flex-col items-center justify-center text-white rounded-full shadow-2xl border-4 border-white/60"
            animate={{
              width: `${cfg.orbScale * 148}px`,
              height: `${cfg.orbScale * 148}px`,
              background: `radial-gradient(circle at 35% 35%, ${cfg.color}cc, ${cfg.color})`,
              boxShadow: `0 12px 40px ${cfg.color}50`,
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.28), transparent 60%)' }} />

            {/* Phase word — animated with meaning */}
            <AnimatePresence mode="wait">
              <motion.span
                key={phase + '-label'}
                className="font-black tracking-widest leading-none relative z-10 text-white drop-shadow"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: cfg.textOpacity, scale: cfg.textScale, fontSize: '13px' }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 3.5, ease: 'easeInOut' }}
              >
                {cfg.title}
              </motion.span>
            </AnimatePresence>

            {/* Timer */}
            <AnimatePresence mode="wait">
              <motion.span
                key={secondsLeft}
                className="font-black tabular-nums leading-none relative z-10 mt-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, fontSize: `${Math.max(28, cfg.orbScale * 28)}px` }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              >
                {secondsLeft}
              </motion.span>
            </AnimatePresence>

            {/* Subtitle */}
            <motion.span
              className="relative z-10 mt-1 font-semibold text-white/75"
              animate={{ fontSize: `${Math.max(8, cfg.orbScale * 8)}px`, opacity: cfg.textOpacity * 0.8 }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
            >
              {cfg.subtitle}
            </motion.span>
          </motion.button>
        </div>

        <p className="text-xs text-gray-400 font-semibold">
          {isRunning ? '⏸ Toque no círculo para pausar' : '▶ Toque no círculo para continuar'}
        </p>
      </div>
    </div>
  );
}
