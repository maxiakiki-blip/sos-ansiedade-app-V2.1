import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Play, Pause, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ButterflyHugProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const TOTAL_CYCLES = 12;
const TAP_INTERVAL = 1100; // ms between left/right

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

  // Auto rhythm engine
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

  const start = () => {
    setPhase('running');
    setIsRunning(true);
    playTap('left');
  };

  const reset = () => {
    setCyclesCompleted(0); setTapCount(0);
    setActiveSide('left'); setIsRunning(false);
    setPhase('intro');
  };

  // ── INTRO — how to position hands ──────────────────────────────
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
            <h2 className="text-xl font-black text-[#1e293b] text-center mb-6">
              Cruce os braços sobre o peito
            </h2>

            {/* Illustration — person with arms crossed on shoulders */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="mb-6"
            >
              <svg viewBox="0 0 160 200" width="180" height="220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Body */}
                <ellipse cx="80" cy="160" rx="38" ry="30" fill="#f1f5f9" />
                {/* Torso */}
                <rect x="60" y="100" width="40" height="50" rx="8" fill="#f1f5f9" />
                {/* Neck */}
                <rect x="73" y="88" width="14" height="16" rx="4" fill="#f1f5f9" />
                {/* Head */}
                <circle cx="80" cy="72" r="24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Eyes closed — peaceful */}
                <path d="M70 70 Q74 73 78 70" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M82 70 Q86 73 90 70" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                {/* Smile */}
                <path d="M74 78 Q80 83 86 78" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

                {/* LEFT arm crossing to RIGHT shoulder */}
                <path d="M62 110 Q58 105 52 100 Q44 94 60 90 Q70 88 88 92"
                  stroke="#b388c4" strokeWidth="8" strokeLinecap="round" fill="none"/>
                {/* LEFT hand on RIGHT shoulder */}
                <circle cx="90" cy="92" r="9" fill="#b388c4" opacity="0.9"/>
                <text x="90" y="96" textAnchor="middle" fontSize="10" fill="white">🤚</text>

                {/* RIGHT arm crossing to LEFT shoulder */}
                <path d="M98 110 Q102 105 108 100 Q116 94 100 90 Q90 88 72 92"
                  stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" fill="none"/>
                {/* RIGHT hand on LEFT shoulder */}
                <circle cx="70" cy="92" r="9" fill="#60a5fa" opacity="0.9"/>
                <text x="70" y="96" textAnchor="middle" fontSize="10" fill="white">🤚</text>

                {/* Butterfly wings (decorative) */}
                <path d="M80 125 Q55 110 45 125 Q50 140 80 130" fill="#b388c4" opacity="0.1"/>
                <path d="M80 125 Q105 110 115 125 Q110 140 80 130" fill="#60a5fa" opacity="0.1"/>
              </svg>
            </motion.div>

            {/* Steps */}
            <div className="w-full space-y-3 max-w-xs">
              {[
                { n: '1', text: 'Cruce o braço esquerdo sobre o peito, mão no ombro direito' },
                { n: '2', text: 'Cruce o braço direito por cima, mão no ombro esquerdo' },
                { n: '3', text: 'O app vai guiar o ritmo — apenas siga tocando alternado' },
              ].map(s => (
                <div key={s.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
                    {s.n}
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            onClick={start}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 mt-8"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)', boxShadow: '0 8px 24px rgba(179,136,196,0.4)' }}
          >
            <Play className="w-5 h-5 fill-current" /> Estou pronto — Começar
          </motion.button>
        </div>
      </div>
    );
  }

  // ── DONE ────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        >
          🦋
        </motion.div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Sessão Concluída!</h2>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1.5 rounded-full border border-purple-200">
            🦋 {TOTAL_CYCLES} ciclos bilaterais
          </span>
          <span className="bg-[#F5EFFF] text-[#b388c4] text-xs font-black px-3 py-1.5 rounded-full border border-[#b388c4]/20">
            +35 XP
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
          A estimulação rítmica alternada ajudou seu cérebro a processar a tensão e reduzir o estado de alerta.
        </p>
        <div className="w-full space-y-3">
          <motion.button onClick={reset} whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir
          </motion.button>
          <motion.button onClick={onBack} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
            Voltar ao Resgate
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── RUNNING ─────────────────────────────────────────────────────
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

        {/* Cycle counter */}
        <div className="w-full max-w-xs mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ciclos</span>
            <AnimatePresence mode="wait">
              <motion.span key={cyclesCompleted}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className="text-xl font-black tabular-nums" style={{ color: '#b388c4' }}>
                {cyclesCompleted}
                <span className="text-sm text-gray-300 font-bold"> / {TOTAL_CYCLES}</span>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                animate={
                  cyclesCompleted > i
                    ? { backgroundColor: '#b388c4', scale: 1 }
                    : cyclesCompleted === i
                    ? { backgroundColor: '#f3e8ff', scale: 1.2, borderWidth: 2, borderColor: '#b388c4' }
                    : { backgroundColor: '#f1f5f9', scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
                {cyclesCompleted > i && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Illustration with pulsing shoulders */}
        <div className="relative flex items-center justify-center mb-4">
          <svg viewBox="0 0 160 200" width="200" height="240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <ellipse cx="80" cy="160" rx="38" ry="30" fill="#f1f5f9" />
            {/* Torso */}
            <rect x="60" y="100" width="40" height="50" rx="8" fill="#f1f5f9" />
            {/* Neck */}
            <rect x="73" y="88" width="14" height="16" rx="4" fill="#f1f5f9" />
            {/* Head */}
            <circle cx="80" cy="72" r="24" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Eyes closed */}
            <path d="M70 70 Q74 73 78 70" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M82 70 Q86 73 90 70" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Smile */}
            <path d="M74 78 Q80 83 86 78" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

            {/* LEFT arm crossing to RIGHT shoulder */}
            <path d="M62 110 Q58 105 52 100 Q44 94 60 90 Q70 88 88 92"
              stroke="#b388c4" strokeWidth="8" strokeLinecap="round" fill="none"/>
            {/* RIGHT arm crossing to LEFT shoulder */}
            <path d="M98 110 Q102 105 108 100 Q116 94 100 90 Q90 88 72 92"
              stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" fill="none"/>

            {/* RIGHT shoulder hand (left arm) — pulses when activeSide === 'left' */}
            <circle cx="90" cy="92" r={activeSide === 'left' ? 11 : 9}
              fill="#b388c4" opacity={activeSide === 'left' ? 1 : 0.55}
              style={{ transition: 'r 0.15s ease, opacity 0.15s ease' }} />
            <text x="90" y="97" textAnchor="middle" fontSize="11" fill="white">🤚</text>

            {/* LEFT shoulder hand (right arm) — pulses when activeSide === 'right' */}
            <circle cx="70" cy="92" r={activeSide === 'right' ? 11 : 9}
              fill="#60a5fa" opacity={activeSide === 'right' ? 1 : 0.55}
              style={{ transition: 'r 0.15s ease, opacity 0.15s ease' }} />
            <text x="70" y="97" textAnchor="middle" fontSize="11" fill="white">🤚</text>

            {/* Butterfly wings */}
            <path d="M80 125 Q55 110 45 125 Q50 140 80 130" fill="#b388c4" opacity="0.08"/>
            <path d="M80 125 Q105 110 115 125 Q110 140 80 130" fill="#60a5fa" opacity="0.08"/>
          </svg>

          {/* Ripple on active shoulder */}
          <AnimatePresence>
            <motion.div
              key={activeSide}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 32, height: 32,
                background: activeSide === 'left' ? '#b388c4' : '#60a5fa',
                // right shoulder is at ~90/160 in 200px wide SVG → roughly 56% from left in 200px = 112px
                // left shoulder is at ~70/160 → ~44% = 88px
                left: activeSide === 'left' ? '53%' : '36%',
                top: '34%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0.6, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </AnimatePresence>
        </div>

        {/* Side label */}
        <AnimatePresence mode="wait">
          <motion.div key={activeSide}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-black uppercase tracking-widest mb-5"
            style={{ color: activeSide === 'left' ? '#b388c4' : '#60a5fa' }}>
            {activeSide === 'left' ? '← Ombro direito' : 'Ombro esquerdo →'}
          </motion.div>
        </AnimatePresence>

        {/* Pause/resume */}
        <motion.button
          onClick={() => setIsRunning(r => !r)}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold text-sm"
          style={{
            borderColor: isRunning ? '#e5e7eb' : '#b388c4',
            color: isRunning ? '#94a3b8' : '#b388c4',
            backgroundColor: isRunning ? '#f8fafc' : '#faf5ff',
          }}
        >
          {isRunning ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4 fill-current" /> Continuar</>}
        </motion.button>
      </div>
    </div>
  );
}
