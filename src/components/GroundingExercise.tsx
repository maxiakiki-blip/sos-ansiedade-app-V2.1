import React, { useState } from 'react';
import { Eye, Hand, Ear, Wind, HeartPulse, ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GroundingExerciseProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
  onComplete?: () => void;
}

const steps = [
  {
    count: 5,
    sense: 'Ver',
    emoji: '👁️',
    icon: Eye,
    color: '#3b82f6',
    bg: '#eff6ff',
    instruction: '5 cosas que puedes VER',
    hint: 'Mirá a tu alrededor. Nombrá 5 objetos.',
    suggestions: ['La pared', 'Mis manos', 'Una ventana', 'Mis zapatos', 'Una sombra', 'Una planta', 'Mi ropa'],
  },
  {
    count: 4,
    sense: 'Sentir',
    emoji: '✋',
    icon: Hand,
    color: '#10b981',
    bg: '#ecfdf5',
    instruction: '4 cosas que puedes SENTIR',
    hint: 'Prestá atención a tu cuerpo. ¿Qué tocás?',
    suggestions: ['El piso bajo mis pies', 'Mi ropa', 'El respaldo', 'El aire en mis brazos', 'Mis manos', 'El asiento'],
  },
  {
    count: 3,
    sense: 'Escuchar',
    emoji: '👂',
    icon: Ear,
    color: '#6366f1',
    bg: '#eef2ff',
    instruction: '3 cosas que puedes ESCUCHAR',
    hint: 'Cerrá los ojos un segundo. ¿Qué sonidos hay?',
    suggestions: ['Silencio', 'El viento', 'Un motor', 'Voces', 'Pasos', 'Mi respiración', 'Un pájaro'],
  },
  {
    count: 2,
    sense: 'Oler',
    emoji: '👃',
    icon: Wind,
    color: '#f59e0b',
    bg: '#fffbeb',
    instruction: '2 cosas que puedes OLER',
    hint: 'Respirá profundo por la nariz.',
    suggestions: ['Aire fresco', 'Mi ropa', 'Perfume', 'Comida', 'La habitación', 'Nada en particular'],
  },
  {
    count: 1,
    sense: 'Saborear',
    emoji: '👅',
    icon: HeartPulse,
    color: '#ec4899',
    bg: '#fdf2f8',
    instruction: '1 cosa que puedes SABOREAR',
    hint: 'Prestá atención a tu boca.',
    suggestions: ['Agua fresca', 'Sabor neutro', 'Chicle', 'Café', 'Fruta', 'Nada en particular'],
  },
];

export default function GroundingExercise({ onBack, logActivity, onComplete }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<string[][]>(steps.map(() => []));
  const [customInput, setCustomInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);

  const step = steps[currentStep];
  const stepSelected = selected[currentStep];
  const remaining = step.count - stepSelected.length;
  const isStepComplete = stepSelected.length >= step.count;

  const toggle = (item: string) => {
    setSelected(prev => {
      const copy = prev.map(a => [...a]);
      const idx = copy[currentStep].indexOf(item);
      if (idx >= 0) {
        copy[currentStep].splice(idx, 1);
      } else if (copy[currentStep].length < step.count) {
        copy[currentStep].push(item);
      }
      return copy;
    });
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val || stepSelected.length >= step.count) return;
    setSelected(prev => {
      const copy = prev.map(a => [...a]);
      if (!copy[currentStep].includes(val)) copy[currentStep].push(val);
      return copy;
    });
    setCustomInput('');
    setShowInput(false);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(s => s + 1);
      setShowInput(false);
    } else {
      setDone(true);
      logActivity('Conexão Sensorial 5-4-3-2-1');
    }
  };

  const skip = () => {
    setSelected(prev => {
      const copy = prev.map(a => [...a]);
      if (copy[currentStep].length === 0) copy[currentStep] = ['✓'];
      return copy;
    });
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(s => s + 1);
      setShowInput(false);
    } else {
      setDone(true);
      logActivity('Conexão Sensorial 5-4-3-2-1');
    }
  };

  if (done) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <div className="text-6xl mb-6">🛡️</div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Ancorado no presente</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          Tus 5 sentidos te trajeron de vuelta. La amígdala se calmó. Estás aquí y estás bien.
        </p>
        <div className="w-full space-y-3">
          {onComplete && (
            <motion.button
              onClick={onComplete}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}
            >
              Siguiente: Abrazo de Mariposa 🦋 <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
          <button onClick={onBack}
            className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-bold">
            Volver al Panel
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <span className="text-sm font-bold text-gray-500">5-4-3-2-1</span>
        <div className="w-10" />
      </div>

      {/* Step dots */}
      <div className="flex gap-2 justify-center mb-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full"
            animate={{
              width: i === currentStep ? 28 : 8,
              background: i < currentStep ? '#10b981' : i === currentStep ? step.color : '#e5e7eb',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="flex flex-col flex-1"
        >
          {/* Icon + instruction */}
          <div className="text-center mb-8">
            <motion.div
              className="text-5xl mb-4 inline-block"
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.05 }}
            >
              {step.emoji}
            </motion.div>
            <h2 className="text-xl font-black text-[#1e293b] mb-1">{step.instruction}</h2>
            <p className="text-sm text-gray-400">{step.hint}</p>
          </div>

          {/* Counter */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: step.count }).map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-black"
                animate={
                  i < stepSelected.length
                    ? { background: step.color, borderColor: step.color, color: '#fff', scale: 1 }
                    : { background: '#f8fafc', borderColor: '#e5e7eb', color: '#cbd5e1', scale: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {i < stepSelected.length ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </motion.div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {step.suggestions.map((sug) => {
              const isSelected = stepSelected.includes(sug);
              const isFull = stepSelected.length >= step.count && !isSelected;
              return (
                <motion.button
                  key={sug}
                  onClick={() => toggle(sug)}
                  disabled={isFull}
                  whileTap={{ scale: 0.94 }}
                  className="px-3 py-2 rounded-full text-sm font-semibold border transition-all disabled:opacity-30"
                  animate={
                    isSelected
                      ? { background: step.color, borderColor: step.color, color: '#fff' }
                      : { background: '#f8fafc', borderColor: '#e5e7eb', color: '#475569' }
                  }
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                >
                  {isSelected ? <span className="flex items-center gap-1"><Check className="w-3 h-3" />{sug}</span> : sug}
                </motion.button>
              );
            })}
            <button
              onClick={() => setShowInput(s => !s)}
              className="px-3 py-2 rounded-full text-sm font-semibold border border-dashed border-gray-300 text-gray-400"
            >
              + Otra
            </button>
          </div>

          {/* Custom input */}
          <AnimatePresence>
            {showInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mb-4 overflow-hidden"
              >
                <input
                  autoFocus
                  type="text"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustom()}
                  placeholder="Escribí lo que ves..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  style={{ borderColor: customInput ? step.color : undefined }}
                />
                <button
                  onClick={addCustom}
                  className="px-4 rounded-xl text-white font-bold text-sm"
                  style={{ background: step.color }}
                >
                  OK
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="space-y-2 mt-auto pt-4">
        {isStepComplete ? (
          <motion.button
            onClick={next}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}cc)`, boxShadow: `0 8px 24px ${step.color}40` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            {currentStep < steps.length - 1 ? 'Siguiente sentido' : 'Terminar'} <ChevronRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <button
            onClick={skip}
            className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm"
          >
            Hacerlo mentalmente (Siguiente)
          </button>
        )}
      </div>
    </div>
  );
}
