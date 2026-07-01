import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TappingProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const POINTS = [
  {
    id: 1,
    name: 'Entre as sobrancelhas',
    subtitle: 'Yintang',
    location: 'Centro entre as sobrancelhas',
    instruction: 'Pressione suavemente com o dedo médio e faça círculos lentos',
    effect: 'Reduz pensamentos acelerados e agitação mental',
    technique: 'circular',
    duration: 30,
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 2,
    name: 'Abaixo do nariz',
    subtitle: 'Renzhong',
    location: 'Sulco nasolabial, centro',
    instruction: 'Pressione com firmeza e segure sem mover',
    effect: 'Restaura a lucidez e reduz o estado de pânico',
    technique: 'static',
    duration: 30,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 3,
    name: 'Queixo',
    subtitle: 'Chengjiang',
    location: 'Depressão central abaixo do lábio inferior',
    instruction: 'Pressão suave contra a mandíbula, segure',
    effect: 'Alivia a tensão da mandíbula causada pelo estresse',
    technique: 'static',
    duration: 20,
    color: '#ec4899',
    bg: '#fdf2f8',
  },
  {
    id: 4,
    name: 'Pulso interno',
    subtitle: 'Neiguan',
    location: '3 dedos abaixo da dobra do pulso, centro',
    instruction: 'Pressione firme em direção ao tendão. Segure 3s, solte, repita',
    effect: 'Acalma náuseas nervosas e coração acelerado',
    technique: 'pulsating',
    duration: 60,
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    id: 5,
    name: 'Centro da palma',
    subtitle: 'Laogong',
    location: 'Onde o dedo médio toca ao fechar o punho',
    instruction: 'Massageie profundamente com a mão oposta em círculos',
    effect: 'Libera a angústia contida no peito',
    technique: 'circular',
    duration: 30,
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    id: 6,
    name: 'Ombro / Trapézio',
    subtitle: 'Jianjing',
    location: 'Ponto médio entre pescoço e ombro',
    instruction: 'Segure o músculo em pinça com polegar e indicador, pressione',
    effect: 'Libera tensão do pescoço e dores de cabeça por estresse',
    technique: 'friction',
    duration: 30,
    color: '#b388c4',
    bg: '#faf5ff',
  },
  {
    id: 7,
    name: 'Abaixo do joelho',
    subtitle: 'Zusanli',
    location: '4 dedos abaixo da patela, lado externo',
    instruction: 'Pressione firme com o polegar. Dê batidinhas rítmicas suaves',
    effect: 'Ancora a energia e reduz o turbilhão de pensamentos',
    technique: 'tapping',
    duration: 40,
    color: '#0891b2',
    bg: '#ecfeff',
  },
];

// SVG illustrations for each point — clean and large
function PointIllustration({ pointId, isActive, color }: { pointId: number; isActive: boolean; color: string }) {
  const pulse = isActive ? (
    <motion.circle
      r={10} fill={color} opacity={0.3}
      animate={{ r: [10, 22, 10], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  ) : null;

  const dot = <circle r={6} fill={color} />;

  if (pointId <= 3) {
    // Face
    const py = pointId === 1 ? 36 : pointId === 2 ? 68 : 80;
    return (
      <svg viewBox="0 0 100 110" className="w-full h-full">
        {/* Head */}
        <ellipse cx={50} cy={52} rx={28} ry={34} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
        {/* Eyebrows */}
        <path d="M33 40 Q40 37 47 40" stroke="#475569" strokeWidth={2} strokeLinecap="round" fill="none"/>
        <path d="M53 40 Q60 37 67 40" stroke="#475569" strokeWidth={2} strokeLinecap="round" fill="none"/>
        {/* Eyes */}
        <path d="M35 47 Q40 50 45 47" stroke="#64748b" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
        <path d="M55 47 Q60 50 65 47" stroke="#64748b" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
        {/* Nose */}
        <path d="M50 52 L47 62 Q50 64 53 62 L50 52" stroke="#94a3b8" strokeWidth={1.2} fill="none" strokeLinecap="round"/>
        {/* Mouth */}
        <path d="M42 73 Q50 77 58 73" stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
        {/* Point */}
        <g transform={`translate(50, ${py})`}>
          {pulse}
          {dot}
        </g>
      </svg>
    );
  }

  if (pointId === 4) {
    // Wrist inner
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        {/* Forearm */}
        <rect x={32} y={5} width={36} height={80} rx={18} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2}/>
        {/* Wrist crease line */}
        <path d="M32 72 Q50 76 68 72" stroke="#cbd5e1" strokeWidth={1.5} fill="none"/>
        {/* Tendons */}
        <path d="M44 72 L44 20" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3,3"/>
        <path d="M56 72 L56 20" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="3,3"/>
        {/* 3 fingers measurement guide */}
        <text x={72} y={52} fontSize={8} fill="#94a3b8" fontWeight="bold">←3</text>
        <text x={72} y={60} fontSize={8} fill="#94a3b8" fontWeight="bold">dedos</text>
        {/* Point */}
        <g transform="translate(50, 52)">
          {pulse}
          {dot}
        </g>
        {/* Hand */}
        <ellipse cx={50} cy={98} rx={20} ry={14} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={1.5}/>
      </svg>
    );
  }

  if (pointId === 5) {
    // Palm
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full">
        {/* Palm shape */}
        <path d="M25 90 L25 50 Q20 40 22 30 Q24 22 30 24 Q35 26 36 38 L38 18 Q38 12 44 12 Q50 12 50 22 L52 10 Q52 4 58 4 Q64 4 64 18 L66 18 Q66 12 72 12 Q78 12 78 28 L78 55 Q74 78 68 90 Z"
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} strokeLinejoin="round"/>
        {/* Palm lines */}
        <path d="M30 55 Q50 50 70 58" stroke="#e2e8f0" strokeWidth={1.5} fill="none"/>
        <path d="M38 42 Q55 60 52 80" stroke="#e2e8f0" strokeWidth={1} fill="none"/>
        {/* Point - center of palm */}
        <g transform="translate(50, 55)">
          {pulse}
          {dot}
        </g>
      </svg>
    );
  }

  if (pointId === 6) {
    // Shoulder / trapezius
    return (
      <svg viewBox="0 0 120 100" className="w-full h-full">
        {/* Neck */}
        <rect x={52} y={0} width={16} height={30} rx={8} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1.5}/>
        {/* Shoulders */}
        <path d="M10 30 Q30 25 60 28 Q90 25 110 30 L110 70 Q90 75 60 72 Q30 75 10 70 Z"
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2}/>
        {/* Trapezius muscle hint */}
        <path d="M60 28 Q80 30 95 38" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="3,2" fill="none"/>
        {/* Point — midpoint shoulder right */}
        <g transform="translate(87, 35)">
          {pulse}
          {dot}
        </g>
      </svg>
    );
  }

  if (pointId === 7) {
    // Knee / leg
    return (
      <svg viewBox="0 0 100 130" className="w-full h-full">
        {/* Upper leg */}
        <rect x={32} y={0} width={36} height={50} rx={16} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2}/>
        {/* Kneecap */}
        <ellipse cx={50} cy={58} rx={18} ry={14} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={2}/>
        {/* Lower leg */}
        <rect x={34} y={68} width={32} height={55} rx={14} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2}/>
        {/* 4 fingers guide */}
        <text x={72} y={88} fontSize={8} fill="#94a3b8" fontWeight="bold">←4</text>
        <text x={72} y={96} fontSize={8} fill="#94a3b8" fontWeight="bold">dedos</text>
        {/* Point */}
        <g transform="translate(64, 84)">
          {pulse}
          {dot}
        </g>
      </svg>
    );
  }

  return null;
}

// Animated movement guide
function TechniqueGuide({ technique, color }: { technique: string; color: string }) {
  if (technique === 'circular') {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          className="w-6 h-6 rounded-full border-2 border-t-transparent"
          style={{ borderColor: color, borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <span className="text-xs font-semibold text-gray-500">Movimentos circulares lentos</span>
      </div>
    );
  }
  if (technique === 'static') {
    return (
      <div className="flex items-center gap-2">
        <motion.div className="w-4 h-4 rounded-full" style={{ background: color }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-gray-500">Pressão firme e constante</span>
      </div>
    );
  }
  if (technique === 'pulsating') {
    return (
      <div className="flex items-center gap-2">
        <motion.div className="w-4 h-4 rounded-full" style={{ background: color }}
          animate={{ scale: [1, 1.4, 1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-gray-500">3s pressão → solte → repita</span>
      </div>
    );
  }
  if (technique === 'tapping') {
    return (
      <div className="flex items-center gap-2">
        <motion.div className="w-4 h-4 rounded-full" style={{ background: color }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-gray-500">Batidinhas rítmicas suaves</span>
      </div>
    );
  }
  if (technique === 'friction') {
    return (
      <div className="flex items-center gap-2">
        <motion.div className="w-4 h-4 rounded-full" style={{ background: color }}
          animate={{ x: [-4, 4, -4] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <span className="text-xs font-semibold text-gray-500">Pressão em pinça no músculo</span>
      </div>
    );
  }
  return null;
}

export default function TappingExercise({ onBack, logActivity }: TappingProps) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(POINTS[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);

  const point = POINTS[step];
  const progress = ((point.duration - timeLeft) / point.duration) * 100;
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (circumference * progress) / 100;

  useEffect(() => {
    setTimeLeft(POINTS[step].duration);
    setIsRunning(false);
  }, [step]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) { setIsRunning(false); return; }
    const id = setInterval(() => setTimeLeft(t => t <= 1 ? 0 : t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  const next = () => {
    if (step < POINTS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      logActivity('Acupressão (7 Pontos)');
    }
  };

  if (done) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
        <div className="text-6xl mb-6">🌿</div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Acupressão Concluída!</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
          Você estimulou os 7 canais energéticos. Sua tensão física foi liberada e seu sistema nervoso está mais equilibrado.
        </p>
        <div className="w-full space-y-3">
          <motion.button onClick={() => { setStep(0); setDone(false); }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Repetir
          </motion.button>
          <motion.button onClick={onBack} whileTap={{ scale: 0.97 }}
            className="w-full py-4 text-white rounded-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
            Voltar à Prevenção
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="text-center">
          <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest block">PREVENÇÃO</span>
          <span className="font-bold text-sm text-[#1e293b]">Acupressão</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5 justify-center mb-6">
        {POINTS.map((_, i) => (
          <motion.div key={i} className="h-1.5 rounded-full"
            animate={{
              width: i === step ? 24 : 8,
              background: i < step ? '#10b981' : i === step ? point.color : '#e5e7eb',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          {/* Point name */}
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: point.color }}>
              Ponto {step + 1} de {POINTS.length} — {point.subtitle}
            </span>
            <h3 className="text-xl font-black text-[#1e293b] mt-1">{point.name}</h3>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: point.bg, color: point.color }}>
              📍 {point.location}
            </div>
          </div>

          {/* Illustration */}
          <div className="w-44 h-44 mx-auto mb-4" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}>
            <PointIllustration pointId={point.id} isActive={isRunning} color={point.color} />
          </div>

          {/* Technique guide */}
          <div className="flex justify-center mb-4">
            <TechniqueGuide technique={point.technique} color={point.color} />
          </div>

          {/* Instruction */}
          <div className="rounded-2xl p-4 mb-5 text-center" style={{ background: point.bg }}>
            <p className="text-sm font-semibold text-[#1e293b] leading-snug">{point.instruction}</p>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center">
            {timeLeft === 0 ? (
              <motion.button onClick={next} whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${point.color}, ${point.color}cc)` }}>
                {step < POINTS.length - 1 ? <><Check className="w-5 h-5" /> Próximo ponto</> : <><Check className="w-5 h-5" /> Concluir</>}
              </motion.button>
            ) : !isRunning ? (
              <motion.button onClick={() => setIsRunning(true)} whileTap={{ scale: 0.97 }}
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>
                <Play className="w-5 h-5 fill-current" /> Iniciar — {point.duration}s
              </motion.button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                {/* Circular timer */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="absolute -rotate-90" width={96} height={96} viewBox="0 0 96 96">
                    <circle cx={48} cy={48} r={44} fill="none" stroke="#f1f5f9" strokeWidth={5} />
                    <circle cx={48} cy={48} r={44} fill="none"
                      stroke={point.color} strokeWidth={5}
                      strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <AnimatePresence mode="wait">
                    <motion.span key={timeLeft}
                      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                      className="text-3xl font-black tabular-nums" style={{ color: point.color }}>
                      {timeLeft}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-xs text-gray-400 font-semibold">{point.effect}</p>
                <button onClick={() => setIsRunning(false)}
                  className="text-xs text-gray-400 underline">Pausar</button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
