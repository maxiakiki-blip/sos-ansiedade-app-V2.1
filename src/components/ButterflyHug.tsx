import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ButterflyHugProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const TOTAL_CYCLES = 12;

export default function ButterflyHug({ onBack, logActivity }: ButterflyHugProps) {
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalTaps, setTotalTaps] = useState(0);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [done, setDone] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  useEffect(() => {
    if (cyclesCompleted >= TOTAL_CYCLES && !done) {
      setDone(true);
      setActiveSide(null);
      logActivity('Abraço de Borboleta');
    }
  }, [cyclesCompleted]);

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
      osc.frequency.setValueAtTime(side === 'left' ? 180 : 200, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      panner.pan.setValueAtTime(side === 'left' ? -0.9 : 0.9, ctx.currentTime);
      osc.connect(panner); panner.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const handleTap = (side: 'left' | 'right') => {
    if (done) return;
    playTap(side);
    setActiveSide(side);
    setTotalTaps(prev => {
      const next = prev + 1;
      if (next % 2 === 0) setCyclesCompleted(c => c + 1);
      return next;
    });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveSide(null), 380);
  };

  const reset = () => {
    setCyclesCompleted(0); setTotalTaps(0);
    setActiveSide(null); setDone(false);
  };

  if (done) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
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

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Header */}
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

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col items-center">

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
          {/* Mini progress dots */}
          <div className="flex gap-1.5 flex-wrap justify-center">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                animate={
                  cyclesCompleted > i
                    ? { backgroundColor: '#b388c4', scale: 1 }
                    : cyclesCompleted === i
                    ? { backgroundColor: '#f3e8ff', scale: 1.15, borderColor: '#b388c4' }
                    : { backgroundColor: '#f1f5f9', scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {cyclesCompleted > i && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instruction */}
        <p className="text-sm text-gray-400 font-medium text-center mb-6 max-w-[240px]">
          Cruzá los brazos sobre el pecho y tocá alternado: <span className="font-black text-[#3b82f6]">izquierda</span> → <span className="font-black text-[#b388c4]">derecha</span>
        </p>

        {/* Main tap area — two large zones */}
        <div className="flex gap-4 w-full max-w-xs mb-8">
          {/* Left */}
          <motion.button
            onClick={() => handleTap('left')}
            className="flex-1 rounded-3xl flex flex-col items-center justify-center py-10 relative overflow-hidden border-2"
            animate={
              activeSide === 'left'
                ? { borderColor: '#3b82f6', backgroundColor: '#eff6ff', scale: 0.97 }
                : { borderColor: '#e5e7eb', backgroundColor: '#fafafa', scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            whileTap={{ scale: 0.94 }}
          >
            <AnimatePresence>
              {activeSide === 'left' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  initial={{ opacity: 0.4, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
                />
              )}
            </AnimatePresence>
            <motion.span
              className="text-4xl mb-2"
              animate={activeSide === 'left' ? { scale: 1.2 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              🤚
            </motion.span>
            <span className="text-xs font-black text-gray-400">ESQUERDA</span>
          </motion.button>

          {/* Right */}
          <motion.button
            onClick={() => handleTap('right')}
            className="flex-1 rounded-3xl flex flex-col items-center justify-center py-10 relative overflow-hidden border-2"
            animate={
              activeSide === 'right'
                ? { borderColor: '#b388c4', backgroundColor: '#faf5ff', scale: 0.97 }
                : { borderColor: '#e5e7eb', backgroundColor: '#fafafa', scale: 1 }
            }
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            whileTap={{ scale: 0.94 }}
          >
            <AnimatePresence>
              {activeSide === 'right' && (
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  initial={{ opacity: 0.4, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: 'radial-gradient(circle, #b388c4, transparent)' }}
                />
              )}
            </AnimatePresence>
            <motion.span
              className="text-4xl mb-2"
              animate={activeSide === 'right' ? { scale: 1.2 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              🤚
            </motion.span>
            <span className="text-xs font-black text-gray-400">DIREITA</span>
          </motion.button>
        </div>

        {/* Live feedback */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeSide ?? 'idle'}
            className="text-sm font-black tracking-wide"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              color: activeSide === 'left' ? '#3b82f6' : activeSide === 'right' ? '#b388c4' : '#cbd5e1'
            }}
          >
            {activeSide === 'left' ? '◀ ESQUERDA' : activeSide === 'right' ? 'DIREITA ▶' : 'ALTERNE O RITMO'}
          </motion.p>
        </AnimatePresence>

      </div>
    </div>
  );
}
