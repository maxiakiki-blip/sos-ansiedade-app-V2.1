import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BreathingExerciseProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
  onComplete: () => void;
}

type BreathingPhase = 'inhale' | 'hold_full' | 'exhale' | 'hold_empty';

const PHASES_ORDER: BreathingPhase[] = ['inhale', 'hold_full', 'exhale', 'hold_empty'];
const TOTAL_CYCLES = 4;

const PHASE_CONFIG: Record<BreathingPhase, {
  title: string;
  subtitle: string;
  color: string;
  orbSize: number; // px, diameter of the orb
}> = {
  inhale:     { title: 'INSPIRAR', subtitle: 'Suave e contínuo',    color: '#3b82f6', orbSize: 190 },
  hold_full:  { title: 'SEGURAR',  subtitle: 'Pulmões cheios',      color: '#10b981', orbSize: 176 },
  exhale:     { title: 'EXPIRAR',  subtitle: 'Solte pela boca',     color: '#b388c4', orbSize: 128 },
  hold_empty: { title: 'RETER',    subtitle: 'Vazio absoluto',      color: '#f59e0b', orbSize: 108 },
};

const PHASE_LABELS: { key: BreathingPhase; short: string }[] = [
  { key: 'inhale',     short: 'Inspirar' },
  { key: 'hold_full',  short: 'Segurar'  },
  { key: 'exhale',     short: 'Expirar'  },
  { key: 'hold_empty', short: 'Reter'    },
];

function playCompletionSound(audioCtx: AudioContext) {
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    const t = audioCtx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t); osc.stop(t + 0.7);
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
    oscRef.current = null; gainRef.current = null;
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
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 3.5);
        gain.gain.linearRampToValueAtTime(0, now + 4);
      }
      osc.start(now);
      oscRef.current = osc; gainRef.current = gain;
    } catch {}
    return () => { stopOscillator(); };
  }, [phase, isMuted, isRunning, done]);

  useEffect(() => {
    if (!isRunning || done) return;
    const id = setInterval(() => setSecondsLeft(p => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, done]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    const idx = PHASES_ORDER.indexOf(phase);
    const next = PHASES_ORDER[(idx + 1) % 4];
    if (phase === 'hold_empty') {
      const n = cyclesCompleted + 1;
      setCyclesCompleted(n);
      if (n >= TOTAL_CYCLES) {
        stopOscillator(); setDone(true);
        logActivity('Respiração Tática');
        if (!isMuted) try { playCompletionSound(getAudioCtx()); } catch {}
        return;
      }
    }
    setPhase(next);
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
        <style>{`@keyframes tb{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)}}.ta{animation:tb 1.5s ease-in-out infinite}`}</style>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ta"
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

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center py-6">

        {/* Cycle counter */}
        <div className="w-full max-w-xs mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ciclos</span>
            <AnimatePresence mode="wait">
              <motion.span key={cyclesCompleted}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className="text-xl font-black tabular-nums" style={{ color: cfg.color }}>
                {cyclesCompleted}<span className="text-sm text-gray-300 font-bold"> / {TOTAL_CYCLES}</span>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div key={i}
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 font-black text-sm"
                animate={
                  cyclesCompleted > i
                    ? { backgroundColor: '#10b981', borderColor: '#10b981', color: '#fff', scale: 1 }
                    : cyclesCompleted === i
                    ? { backgroundColor: cfg.color + '22', borderColor: cfg.color, color: cfg.color, scale: 1.08 }
                    : { backgroundColor: '#f8fafc', borderColor: '#e5e7eb', color: '#cbd5e1', scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                {cyclesCompleted > i ? '✓' : i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Orb — animates size, text always legible */}
        <div className="flex items-center justify-center mb-6" style={{ width: 220, height: 220 }}>
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className="relative flex flex-col items-center justify-center rounded-full text-white shadow-2xl border-[5px] border-white"
            animate={{
              width: cfg.orbSize,
              height: cfg.orbSize,
              backgroundColor: cfg.color,
              boxShadow: `0 12px 48px ${cfg.color}55`,
            }}
            transition={{ duration: 3.8, ease: 'easeInOut' }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.3), transparent 60%)' }} />

            {/* Phase name — fixed size, always visible */}
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                className="relative z-10 font-black text-white leading-none text-center"
                style={{ fontSize: 13, letterSpacing: '0.12em' }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {cfg.title}
              </motion.span>
            </AnimatePresence>

            {/* Timer — large, always visible */}
            <AnimatePresence mode="wait">
              <motion.span
                key={secondsLeft}
                className="relative z-10 font-black text-white tabular-nums leading-none mt-1"
                style={{ fontSize: 44 }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              >
                {secondsLeft}
              </motion.span>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.span
                key={phase + '-sub'}
                className="relative z-10 text-white/75 font-semibold mt-1 text-center px-2"
                style={{ fontSize: 9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {cfg.subtitle}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Phase steps — minimal pill row */}
        <div className="flex gap-1.5 mb-5">
          {PHASE_LABELS.map(({ key, short }) => (
            <motion.div
              key={key}
              className="flex flex-col items-center px-3 py-2 rounded-xl border text-center"
              animate={
                phase === key
                  ? { backgroundColor: PHASE_CONFIG[key].color, borderColor: PHASE_CONFIG[key].color, color: '#fff', scale: 1.05 }
                  : PHASES_ORDER.indexOf(key) < PHASES_ORDER.indexOf(phase) || (phase === 'inhale' && cyclesCompleted > 0 && key === 'hold_empty')
                  ? { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a', scale: 1 }
                  : { backgroundColor: '#f8fafc', borderColor: '#e5e7eb', color: '#94a3b8', scale: 1 }
              }
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            >
              <span className="text-[10px] font-black leading-none">{short}</span>
              <span className="text-[8px] opacity-60 mt-0.5">4 seg</span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-semibold">
          {isRunning ? '⏸ Toque no círculo para pausar' : '▶ Toque no círculo para continuar'}
        </p>
      </div>
    </div>
  );
}
