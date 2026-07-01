import React, { useState, useEffect } from 'react';
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
    location: 'Centro exato entre as sobrancelhas',
    instruction: 'Pressione com o dedo médio e faça círculos lentos',
    effect: 'Reduz pensamentos acelerados e agitação',
    technique: 'circular',
    duration: 30,
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 2,
    name: 'Abaixo do nariz',
    subtitle: 'Renzhong',
    location: 'Sulco central entre nariz e lábio superior',
    instruction: 'Pressione com firmeza e segure sem mover',
    effect: 'Restaura a lucidez e reduz o pânico',
    technique: 'static',
    duration: 30,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 3,
    name: 'Ponta do queixo',
    subtitle: 'Chengjiang',
    location: 'Depressão central abaixo do lábio inferior',
    instruction: 'Pressão suave contra o osso do queixo',
    effect: 'Alivia tensão da mandíbula causada por estresse',
    technique: 'static',
    duration: 20,
    color: '#ec4899',
    bg: '#fdf2f8',
  },
  {
    id: 4,
    name: 'Pulso interno',
    subtitle: 'Neiguan',
    location: '3 dedos abaixo da dobra do pulso',
    instruction: 'Pressione firme no centro. Segure 3s, solte, repita',
    effect: 'Acalma coração acelerado e náuseas nervosas',
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
    instruction: 'Massageie com o polegar da mão oposta em círculos',
    effect: 'Libera a angústia acumulada no peito',
    technique: 'circular',
    duration: 30,
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    id: 6,
    name: 'Ombro / Trapézio',
    subtitle: 'Jianjing',
    location: 'Meio caminho entre pescoço e ombro',
    instruction: 'Aperte o músculo em pinça com polegar e indicador',
    effect: 'Libera tensão do pescoço e dores de cabeça',
    technique: 'friction',
    duration: 30,
    color: '#b388c4',
    bg: '#faf5ff',
  },
  {
    id: 7,
    name: 'Abaixo do joelho',
    subtitle: 'Zusanli',
    location: '4 dedos abaixo da patela, lado externo da tíbia',
    instruction: 'Pressione firme com o polegar e dê batidinhas suaves',
    effect: 'Ancora a mente e reduz o turbilhão de pensamentos',
    technique: 'tapping',
    duration: 40,
    color: '#0891b2',
    bg: '#ecfeff',
  },
];

// ─── SVG Illustrations — anatomically clear ─────────────────────────────────

function PointSVG({ id, color, isActive }: { id: number; color: string; isActive: boolean }) {
  // Shared pulse rings component
  const PulseRings = ({ cx, cy }: { cx: number; cy: number }) => (
    <>
      {isActive && [1, 2, 3].map(i => (
        <motion.circle key={i} cx={cx} cy={cy} r={8} fill="none" stroke={color} strokeWidth={2}
          initial={{ r: 8, opacity: 0.8 }}
          animate={{ r: 8 + i * 12, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.38, ease: 'easeOut' }} />
      ))}
      <motion.circle cx={cx} cy={cy} r={6} fill={color}
        animate={isActive ? { r: [6, 8, 6], opacity: [1, 0.7, 1] } : { r: 6, opacity: 0.85 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />
    </>
  );

  if (id === 1) {
    // Full face — eyebrows very prominent, point between them
    return (
      <svg viewBox="0 0 120 150" className="w-full h-full">
        {/* Hair */}
        <ellipse cx={60} cy={28} rx={34} ry={20} fill="#e2e8f0" />
        {/* Head */}
        <ellipse cx={60} cy={68} rx={34} ry={42} fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5} />
        {/* Ears */}
        <ellipse cx={26} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        <ellipse cx={94} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        {/* Eyebrows — thick and clear */}
        <path d="M36 52 Q48 47 56 50" stroke="#92400e" strokeWidth={4} strokeLinecap="round" fill="none"/>
        <path d="M64 50 Q72 47 84 52" stroke="#92400e" strokeWidth={4} strokeLinecap="round" fill="none"/>
        {/* Eyes */}
        <ellipse cx={46} cy={62} rx={8} ry={5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={46} cy={62} r={3} fill="#475569"/>
        <ellipse cx={74} cy={62} rx={8} ry={5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={74} cy={62} r={3} fill="#475569"/>
        {/* Nose */}
        <path d="M60 68 L56 80 Q60 83 64 80 L60 68" fill="none" stroke="#d97706" strokeWidth={1.5} strokeLinejoin="round"/>
        {/* Mouth */}
        <path d="M50 94 Q60 100 70 94" stroke="#b45309" strokeWidth={2} strokeLinecap="round" fill="none"/>
        {/* Point — BETWEEN eyebrows */}
        <PulseRings cx={60} cy={50} />
        {/* Arrow hint */}
        <motion.line x1={60} y1={35} x2={60} y2={44} stroke={color} strokeWidth={2} strokeLinecap="round"
          animate={{ y1: [33, 37, 33] }} transition={{ duration: 1.2, repeat: Infinity }} />
        <polygon points="56,44 60,50 64,44" fill={color} opacity={0.6} />
      </svg>
    );
  }

  if (id === 2) {
    // Face profile / front — philtrum (groove below nose) highlighted
    return (
      <svg viewBox="0 0 120 150" className="w-full h-full">
        <ellipse cx={60} cy={28} rx={34} ry={20} fill="#e2e8f0" />
        <ellipse cx={60} cy={68} rx={34} ry={42} fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5} />
        <ellipse cx={26} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        <ellipse cx={94} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        <path d="M36 52 Q48 47 56 50" stroke="#92400e" strokeWidth={3} strokeLinecap="round" fill="none"/>
        <path d="M64 50 Q72 47 84 52" stroke="#92400e" strokeWidth={3} strokeLinecap="round" fill="none"/>
        <ellipse cx={46} cy={62} rx={7} ry={4.5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={46} cy={62} r={2.5} fill="#475569"/>
        <ellipse cx={74} cy={62} rx={7} ry={4.5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={74} cy={62} r={2.5} fill="#475569"/>
        {/* Nose — more defined, with nostrils */}
        <path d="M60 64 L56 78 Q58 82 60 82 Q62 82 64 78 L60 64" fill="#fde68a" stroke="#d97706" strokeWidth={1.5} strokeLinejoin="round"/>
        <ellipse cx={56} cy={79} rx={3} ry={2} fill="#fbbf24"/>
        <ellipse cx={64} cy={79} rx={3} ry={2} fill="#fbbf24"/>
        {/* Philtrum groove */}
        <path d="M58 82 L58 89 M62 82 L62 89" stroke="#d97706" strokeWidth={1} opacity={0.5}/>
        {/* Upper lip */}
        <path d="M50 92 Q56 89 60 91 Q64 89 70 92" stroke="#b45309" strokeWidth={2} strokeLinecap="round" fill="none"/>
        {/* Lower lip */}
        <path d="M50 92 Q60 100 70 92" stroke="#b45309" strokeWidth={2} strokeLinecap="round" fill="none"/>
        {/* POINT — philtrum, between nose and lip */}
        <PulseRings cx={60} cy={88} />
        <motion.line x1={84} y1={82} x2={68} y2={88} stroke={color} strokeWidth={1.5} strokeLinecap="round"
          animate={{ x1: [86, 82, 86] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </svg>
    );
  }

  if (id === 3) {
    // Face — chin clearly shown
    return (
      <svg viewBox="0 0 120 150" className="w-full h-full">
        <ellipse cx={60} cy={28} rx={34} ry={20} fill="#e2e8f0" />
        {/* Head with pointier chin */}
        <path d="M26 68 Q26 100 60 118 Q94 100 94 68 Q94 26 60 26 Q26 26 26 68Z" fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        <ellipse cx={26} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        <ellipse cx={94} cy={68} rx={5} ry={8} fill="#fde68a" stroke="#fbbf24" strokeWidth={1} />
        <path d="M36 52 Q48 47 56 50" stroke="#92400e" strokeWidth={3} strokeLinecap="round" fill="none"/>
        <path d="M64 50 Q72 47 84 52" stroke="#92400e" strokeWidth={3} strokeLinecap="round" fill="none"/>
        <ellipse cx={46} cy={62} rx={7} ry={4.5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={46} cy={62} r={2.5} fill="#475569"/>
        <ellipse cx={74} cy={62} rx={7} ry={4.5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
        <circle cx={74} cy={62} r={2.5} fill="#475569"/>
        <path d="M60 68 L56 78 Q60 81 64 78 L60 68" fill="none" stroke="#d97706" strokeWidth={1.5}/>
        {/* Mouth */}
        <path d="M50 90 Q60 96 70 90" stroke="#b45309" strokeWidth={2} strokeLinecap="round" fill="none"/>
        <path d="M50 90 Q60 86 70 90" stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
        {/* Chin cleft */}
        <path d="M60 105 L60 112" stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" opacity={0.6}/>
        {/* POINT — chin depression */}
        <PulseRings cx={60} cy={108} />
        <motion.line x1={84} y1={100} x2={68} y2={107} stroke={color} strokeWidth={1.5} strokeLinecap="round"
          animate={{ x1: [86, 82, 86] }} transition={{ duration: 1.2, repeat: Infinity }} />
      </svg>
    );
  }

  if (id === 4) {
    // Forearm / inner wrist — very clear anatomy
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full">
        {/* Forearm body */}
        <path d="M35 10 Q28 10 26 30 L26 105 Q26 118 38 120 L82 120 Q94 118 94 105 L94 30 Q92 10 85 10 Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={2}/>
        {/* Wrist crease — double line */}
        <path d="M28 100 Q60 107 92 100" stroke="#d97706" strokeWidth={2} fill="none" opacity={0.7}/>
        <path d="M29 105 Q60 111 91 105" stroke="#fbbf24" strokeWidth={1} fill="none" opacity={0.4}/>
        {/* Tendons — 3 visible on inner wrist */}
        <path d="M48 100 L46 20" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5}/>
        <path d="M60 102 L60 18" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5}/>
        <path d="M72 100 L74 20" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5}/>
        {/* 3 finger width marker */}
        <rect x={96} y={65} width={18} height={36} rx={3} fill={color} opacity={0.15} stroke={color} strokeWidth={1}/>
        <text x={105} y={77} textAnchor="middle" fontSize={7} fill={color} fontWeight="bold">3</text>
        <text x={105} y={86} textAnchor="middle" fontSize={7} fill={color} fontWeight="bold">ded.</text>
        <line x1={94} y1={65} x2={98} y2={65} stroke={color} strokeWidth={1.5}/>
        <line x1={94} y1={101} x2={98} y2={101} stroke={color} strokeWidth={1.5}/>
        {/* Hand fingers hint */}
        {[38,48,58,68,78].map((x,i) => (
          <rect key={i} x={x} y={120} width={8} height={i===0?18:22} rx={4}
            fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        ))}
        {/* POINT — 3 fingers below wrist crease = at y≈83 */}
        <PulseRings cx={60} cy={83} />
      </svg>
    );
  }

  if (id === 5) {
    // Palm — open hand facing viewer, very clear lines
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full">
        {/* Thumb */}
        <path d="M22 80 Q14 60 18 45 Q22 32 34 36 Q40 40 38 58 L36 80Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Index */}
        <path d="M38 80 L36 30 Q37 20 44 20 Q51 20 52 30 L52 80Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Middle */}
        <path d="M54 80 L52 22 Q53 12 60 12 Q67 12 68 22 L68 80Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Ring */}
        <path d="M70 80 L68 28 Q69 18 76 20 Q83 22 84 32 L84 80Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Pinky */}
        <path d="M86 80 L84 42 Q85 34 91 36 Q97 38 98 48 L98 80Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Palm body */}
        <path d="M22 80 L22 120 Q22 135 60 138 Q98 135 98 120 L98 80 Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Palm lines */}
        <path d="M28 95 Q55 88 90 95" stroke="#fbbf24" strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        <path d="M32 108 Q50 118 72 112 Q85 108 92 105" stroke="#fbbf24" strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        <path d="M42 80 Q46 100 44 118" stroke="#fbbf24" strokeWidth={1} fill="none" opacity={0.5}/>
        {/* Finger joints */}
        {[[44,55],[60,52],[76,57],[91,62]].map(([x,y],i)=>(
          <path key={i} d={`M${x-5} ${y} Q${x} ${y-3} ${x+5} ${y}`} stroke="#fbbf24" strokeWidth={1} fill="none" opacity={0.4}/>
        ))}
        {/* POINT — center of palm (Laogong) */}
        <PulseRings cx={60} cy={105} />
      </svg>
    );
  }

  if (id === 6) {
    // Shoulder / trapezius — neck + shoulder slope clearly visible from front
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full">
        {/* Neck */}
        <path d="M66 0 Q58 0 56 15 L56 50 Q62 56 80 56 Q98 56 104 50 L104 15 Q102 0 94 0 Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Collarbone hint */}
        <path d="M30 60 Q60 54 80 58 Q100 54 130 60" stroke="#fbbf24" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6}/>
        {/* Left shoulder slope */}
        <path d="M56 20 Q40 28 20 50 Q10 62 14 72 L50 80 Q56 72 56 56Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Right shoulder slope */}
        <path d="M104 20 Q120 28 140 50 Q150 62 146 72 L110 80 Q104 72 104 56Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Trapezius muscle shape — highlighted */}
        <path d="M80 10 Q80 10 56 28 Q40 42 30 60 Q50 62 80 58 Q110 62 130 60 Q120 42 104 28 Q80 10 80 10Z"
          fill={color} opacity={0.08} stroke={color} strokeWidth={1} strokeDasharray="4,3"/>
        {/* Neck sternocleidomastoid lines */}
        <path d="M70 50 L66 10" stroke="#fbbf24" strokeWidth={1} opacity={0.4}/>
        <path d="M90 50 L94 10" stroke="#fbbf24" strokeWidth={1} opacity={0.4}/>
        {/* Label: midpoint marker */}
        <line x1={80} y1={54} x2={130} y2={54} stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.4}/>
        {/* POINT — midpoint right shoulder trapezius */}
        <PulseRings cx={117} cy={46} />
        <motion.path d="M100 30 Q108 38 114 44" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round"
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}/>
      </svg>
    );
  }

  if (id === 7) {
    // Leg / knee — clear patella + lower leg with marked point
    return (
      <svg viewBox="0 0 120 180" className="w-full h-full">
        {/* Upper thigh */}
        <path d="M32 0 Q26 0 24 10 L24 65 Q24 75 60 78 Q96 75 96 65 L96 10 Q94 0 88 0 Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Kneecap (patella) — oval, prominent */}
        <ellipse cx={60} cy={85} rx={24} ry={18} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2}/>
        <ellipse cx={60} cy={85} rx={16} ry={12} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={1}/>
        {/* Lower leg */}
        <path d="M36 100 Q30 102 30 115 L30 175 Q30 180 60 180 Q90 180 90 175 L90 115 Q90 102 84 100 Z"
          fill="#fef3c7" stroke="#fde68a" strokeWidth={1.5}/>
        {/* Tibia bone ridge (shin) */}
        <path d="M60 100 L60 175" stroke="#fde68a" strokeWidth={3} strokeLinecap="round" opacity={0.5}/>
        {/* Fibula (outer) */}
        <path d="M82 105 L85 170" stroke="#fde68a" strokeWidth={1.5} strokeLinecap="round" opacity={0.3}/>
        {/* 4 finger width marker */}
        <rect x={93} y={100} width={20} height={44} rx={3} fill={color} opacity={0.12} stroke={color} strokeWidth={1}/>
        <text x={103} y={116} textAnchor="middle" fontSize={7} fill={color} fontWeight="bold">4</text>
        <text x={103} y={127} textAnchor="middle" fontSize={7} fill={color} fontWeight="bold">ded.</text>
        <line x1={91} y1={100} x2={95} y2={100} stroke={color} strokeWidth={1.5}/>
        <line x1={91} y1={144} x2={95} y2={144} stroke={color} strokeWidth={1.5}/>
        {/* POINT — Zusanli, outer side of tibia 4 fingers below knee */}
        <PulseRings cx={80} cy={122} />
      </svg>
    );
  }

  return null;
}

// Technique animation
function TechniqueGuide({ technique, color }: { technique: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
        {technique === 'circular' && (
          <motion.div className="w-4 h-4 rounded-full border-2 border-t-transparent"
            style={{ borderColor: color, borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
        )}
        {technique === 'static' && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }} />
        )}
        {technique === 'pulsating' && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ scale: [1, 1.6, 1, 1.6, 1], opacity: [1, 0.5, 1, 0.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }} />
        )}
        {technique === 'tapping' && (
          <motion.div className="w-2.5 h-2.5 rounded-full" style={{ background: color }}
            animate={{ y: [0, -5, 0] }} transition={{ duration: 0.35, repeat: Infinity }} />
        )}
        {technique === 'friction' && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ x: [-4, 4, -4] }} transition={{ duration: 0.45, repeat: Infinity }} />
        )}
      </div>
      <span className="text-xs font-semibold text-gray-500">
        {technique === 'circular' && 'Movimentos circulares lentos'}
        {technique === 'static' && 'Pressão firme e constante'}
        {technique === 'pulsating' && 'Pressiona 3s → solta → repete'}
        {technique === 'tapping' && 'Batidinhas rítmicas suaves'}
        {technique === 'friction' && 'Aperto em pinça no músculo'}
      </span>
    </div>
  );
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

  useEffect(() => { setTimeLeft(POINTS[step].duration); setIsRunning(false); }, [step]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) { setIsRunning(false); return; }
    const id = setInterval(() => setTimeLeft(t => t <= 1 ? 0 : t - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft]);

  const next = () => {
    if (step < POINTS.length - 1) setStep(s => s + 1);
    else { setDone(true); logActivity('Acupressão (7 Pontos)'); }
  };

  if (done) {
    return (
      <motion.div className="flex flex-col items-center justify-center min-h-[65vh] text-center p-6"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
        <div className="text-6xl mb-6">🌿</div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Acupressão Concluída!</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-8">
          Você estimulou os 7 canais energéticos. Sua tensão física foi liberada.
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
      <div className="flex gap-1.5 justify-center mb-5">
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
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          {/* Point name */}
          <div className="text-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: point.color }}>
              Ponto {step + 1} de {POINTS.length} · {point.subtitle}
            </span>
            <h3 className="text-lg font-black text-[#1e293b] mt-0.5">{point.name}</h3>
            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: point.bg, color: point.color }}>
              📍 {point.location}
            </div>
          </div>

          {/* Illustration — floating animation */}
          <motion.div
            className="mx-auto mb-3"
            style={{ width: 160, height: 160 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PointSVG id={point.id} color={point.color} isActive={isRunning} />
          </motion.div>

          {/* Technique */}
          <div className="flex justify-center mb-3">
            <TechniqueGuide technique={point.technique} color={point.color} />
          </div>

          {/* Instruction card */}
          <div className="rounded-2xl p-3.5 mb-4 text-center" style={{ background: point.bg }}>
            <p className="text-sm font-semibold text-[#1e293b] leading-snug">{point.instruction}</p>
          </div>

          {/* Timer / CTA */}
          <div className="flex flex-col items-center">
            {timeLeft === 0 ? (
              <motion.button onClick={next} whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${point.color}, ${point.color}cc)` }}>
                <Check className="w-5 h-5" />
                {step < POINTS.length - 1 ? 'Próximo ponto' : 'Concluir'}
              </motion.button>
            ) : !isRunning ? (
              <motion.button onClick={() => setIsRunning(true)} whileTap={{ scale: 0.97 }}
                className="w-full py-4 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>
                <Play className="w-5 h-5 fill-current" /> Iniciar · {point.duration}s
              </motion.button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="absolute -rotate-90" width={96} height={96} viewBox="0 0 96 96">
                    <circle cx={48} cy={48} r={44} fill="none" stroke="#f1f5f9" strokeWidth={5} />
                    <circle cx={48} cy={48} r={44} fill="none"
                      stroke={point.color} strokeWidth={5}
                      strokeDasharray={circumference} strokeDashoffset={dashOffset}
                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <AnimatePresence mode="wait">
                    <motion.span key={timeLeft}
                      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                      className="text-3xl font-black tabular-nums" style={{ color: point.color }}>
                      {timeLeft}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold text-center max-w-[200px]">{point.effect}</p>
                <button onClick={() => setIsRunning(false)} className="text-xs text-gray-400 underline mt-1">Pausar</button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
