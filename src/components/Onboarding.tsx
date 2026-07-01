import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '💜',
    title: 'Bem-vindo ao S.O.S Ansiedade',
    subtitle: 'Seu espaço seguro para momentos difíceis',
    description: 'Este app foi criado para te ajudar quando a ansiedade aparecer — com técnicas comprovadas, simples e acessíveis.',
    bg: 'from-[#9d6eb5] to-[#b388c4]',
  },
  {
    emoji: '🆘',
    title: 'Resgate Imediato',
    subtitle: 'Aba Resgate',
    description: 'Quando a ansiedade bate, acessa essa aba. Tem respiração tática, conexão sensorial, abraço de borboleta e mais. Cada técnica te guia passo a passo.',
    bg: 'from-[#6366f1] to-[#8b5cf6]',
  },
  {
    emoji: '🛡️',
    title: 'Prevenção Diária',
    subtitle: 'Aba Prevenção',
    description: 'Registra como você tá se sentindo todo dia e pratica hábitos que reduzem a ansiedade ao longo do tempo. Pequenos passos, grandes mudanças.',
    bg: 'from-[#0891b2] to-[#06b6d4]',
  },
  {
    emoji: '🏆',
    title: 'Conquistas & Progresso',
    subtitle: 'Aba Progresso',
    description: 'Ganhas XP, manténs sua racha diária e desbloqueas badges. Teu progresso fica salvo na nuvem — em qualquer dispositivo.',
    bg: 'from-[#d97706] to-[#f59e0b]',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(145deg, #F9F4FE 0%, #EDE0F5 40%, #E8F4FF 100%)' }}>

      <div className="w-full max-w-sm flex flex-col items-center">

        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-2xl mb-8 bg-gradient-to-br ${slide.bg}`}
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              {slide.emoji}
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-[#b388c4] mb-2">{slide.subtitle}</p>
            <h2 className="text-2xl font-black text-[#1e293b] mb-4 leading-tight">{slide.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-10 mb-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? '#b388c4' : '#d1c4e9',
              }} />
          ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3">
          {current > 0 && (
            <button onClick={goPrev}
              className="flex-1 py-4 rounded-2xl font-bold text-sm border-2 border-[#b388c4]/30 text-[#b388c4] hover:bg-[#b388c4]/10 transition-all active:scale-95">
              Anterior
            </button>
          )}
          <motion.button
            onClick={goNext}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 text-white rounded-2xl font-bold shadow-lg text-sm flex justify-center items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #b388c4 0%, #9d6eb5 100%)', boxShadow: '0 8px 24px rgba(179,136,196,0.4)' }}
          >
            {current === slides.length - 1 ? (
              <><Check className="w-4 h-4" /> Começar!</>
            ) : (
              <>Próximo <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>

        {/* Skip */}
        {current < slides.length - 1 && (
          <button onClick={onComplete} className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors py-2">
            Pular introdução
          </button>
        )}
      </div>
    </div>
  );
}
