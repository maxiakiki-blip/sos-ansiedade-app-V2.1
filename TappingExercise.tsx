import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TappingProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

const POINTS = [
  { id: 1, name: 'Entre as sobrancelhas', subtitle: 'Yintang', location: 'Centro exato entre as sobrancelhas', instruction: 'Pressione com o dedo médio e faça círculos lentos', effect: 'Reduz pensamentos acelerados e agitação', technique: 'circular', duration: 30, color: '#6366f1', bg: '#eef2ff' },
  { id: 2, name: 'Abaixo do nariz', subtitle: 'Renzhong', location: 'Sulco central entre nariz e lábio superior', instruction: 'Pressione com firmeza e segure sem mover', effect: 'Restaura a lucidez e reduz o pânico', technique: 'static', duration: 30, color: '#f59e0b', bg: '#fffbeb' },
  { id: 3, name: 'Ponta do queixo', subtitle: 'Chengjiang', location: 'Depressão central abaixo do lábio inferior', instruction: 'Pressão suave contra o osso do queixo', effect: 'Alivia tensão da mandíbula causada por estresse', technique: 'static', duration: 20, color: '#ec4899', bg: '#fdf2f8' },
  { id: 4, name: 'Pulso interno', subtitle: 'Neiguan', location: '3 dedos abaixo da dobra do pulso', instruction: 'Pressione o ponto com o polegar. Segure 3s, solte, repita', effect: 'Acalma coração acelerado e náuseas nervosas', technique: 'pulsating', duration: 60, color: '#3b82f6', bg: '#eff6ff' },
  { id: 5, name: 'Centro da palma', subtitle: 'Laogong', location: 'Onde o dedo médio toca ao fechar o punho', instruction: 'Massageie com o polegar da mão oposta em círculos', effect: 'Libera a angústia acumulada no peito', technique: 'circular', duration: 30, color: '#10b981', bg: '#ecfdf5' },
  { id: 6, name: 'Ombro / Trapézio', subtitle: 'Jianjing', location: 'Meio caminho entre pescoço e ombro', instruction: 'Aperte o músculo em pinça com polegar e indicador', effect: 'Libera tensão do pescoço e dores de cabeça', technique: 'friction', duration: 30, color: '#b388c4', bg: '#faf5ff' },
  { id: 7, name: 'Abaixo do joelho', subtitle: 'Zusanli', location: '4 dedos abaixo da patela, lado externo da tíbia', instruction: 'Pressione firme com o polegar e dê batidinhas suaves', effect: 'Ancora a mente e reduz o turbilhão de pensamentos', technique: 'tapping', duration: 40, color: '#0891b2', bg: '#ecfeff' },
];

const S = { skin: '#F5C9A0', skinD: '#E8A87C', skinL: '#FAE0C8', nail: '#F9CEC3', hair: '#3D2314', lip: '#C8877A', white: '#fff', vein: '#9BB5D6' };

function PulseRings({ cx, cy, color, active }: { cx: number; cy: number; color: string; active: boolean }) {
  return (
    <>
      {active && [1, 2, 3].map(i => (
        <motion.circle key={i} cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={1.5}
          initial={{ r: 7, opacity: 0.9 }}
          animate={{ r: 7 + i * 11, opacity: 0 }}
          transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.36, ease: 'easeOut' }} />
      ))}
      <motion.circle cx={cx} cy={cy} r={5} fill={color}
        animate={active ? { r: [5, 7, 5], opacity: [1, 0.65, 1] } : { r: 5, opacity: 0.9 }}
        transition={{ duration: 1, repeat: Infinity }} />
    </>
  );
}

function IndexFingerDown({ x, y, color = S.skin, scale = 1 }: { x: number; y: number; color?: string; scale?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={28} rx={7} ry={8} fill={S.skinD} />
      <rect x={-6} y={8} width={12} height={20} rx={5} fill={color} />
      <path d="M-5 16 Q0 14 5 16" stroke={S.skinD} strokeWidth={1} fill="none" />
      <rect x={-6} y={-8} width={12} height={18} rx={5} fill={color} />
      <rect x={-4} y={-6} width={8} height={10} rx={3} fill={S.nail} stroke={S.skinD} strokeWidth={0.5} />
    </g>
  );
}

function ThumbSideways({ x, y, flipX = false }: { x: number; y: number; flipX?: boolean }) {
  const sc = flipX ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${sc}, 1)`}>
      <ellipse cx={0} cy={0} rx={9} ry={7} fill={S.skinD} />
      <rect x={0} y={-6} width={20} height={12} rx={5} fill={S.skin} />
      <rect x={2} y={-4} width={10} height={8} rx={3} fill={S.nail} stroke={S.skinD} strokeWidth={0.5} />
      <path d="M20 -6 Q32 -8 36 0 Q32 8 20 6 Z" fill={S.skin} />
    </g>
  );
}

function PointSVG({ id, color, isActive }: { id: number; color: string; isActive: boolean }) {
  function HumanFace({ pointY, childrenOverlay }: { pointY: number; childrenOverlay: React.ReactNode }) {
    return (
      <svg viewBox="0 0 140 180" className="w-full h-full">
        <ellipse cx={70} cy={48} rx={44} ry={30} fill={S.hair} />
        <path d="M28 75 Q26 55 70 42 Q114 55 112 75 Q114 120 70 140 Q26 120 28 75Z" fill={S.skin} />
        <ellipse cx={27} cy={85} rx={6} ry={9} fill={S.skin} stroke={S.skinD} strokeWidth={1} />
        <ellipse cx={113} cy={85} rx={6} ry={9} fill={S.skin} stroke={S.skinD} strokeWidth={1} />
        <path d="M30 72 Q50 44 70 42 Q90 44 110 72 Q90 58 70 56 Q50 58 30 72Z" fill={S.hair} />
        <path d="M40 72 Q55 66 64 70" stroke={S.hair} strokeWidth={3.5} strokeLinecap="round" fill="none"/>
        <path d="M76 70 Q85 66 100 72" stroke={S.hair} strokeWidth={3.5} strokeLinecap="round" fill="none"/>
        <ellipse cx={52} cy={82} rx={9} ry={6} fill="white" stroke={S.skinD} strokeWidth={0.5}/>
        <ellipse cx={52} cy={82} rx={5} ry={5} fill="#3D2314"/>
        <ellipse cx={54} cy={80} rx={1.5} ry={1.5} fill="white"/>
        <ellipse cx={88} cy={82} rx={9} ry={6} fill="white" stroke={S.skinD} strokeWidth={0.5}/>
        <ellipse cx={88} cy={82} rx={5} ry={5} fill="#3D2314"/>
        <ellipse cx={90} cy={80} rx={1.5} ry={1.5} fill="white"/>
        <path d="M70 88 Q66 100 64 105 Q70 108 76 105 Q74 100 70 88Z" fill={S.skinD} opacity={0.6}/>
        <ellipse cx={65} cy={104} rx={4} ry={2.5} fill={S.skinD}/>
        <ellipse cx={75} cy={104} rx={4} ry={2.5} fill={S.skinD}/>
        <path d="M68 108 L68 116 M72 108 L72 116" stroke={S.skinD} strokeWidth={0.8} opacity={0.5}/>
        <path d="M57 118 Q70 113 83 118 Q70 126 57 118Z" fill={S.lip}/>
        <path d="M57 118 Q70 122 83 118" stroke={S.lip} strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        <PulseRings cx={70} cy={pointY} color={color} active={isActive} />
        {childrenOverlay}
      </svg>
    );
  }

  if (id === 1) {
    return (
      <HumanFace pointY={67}>
        <motion.g animate={{ y: isActive ? [0, 3, 0] : 0 }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
          <IndexFingerDown x={70} y={22} />
        </motion.g>
        {isActive && (
          <motion.path d="M60 67 A12 12 0 1 1 59 74" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
            animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '70px 67px' }} />
        )}
        {!isActive && <path d="M58 55 A14 14 0 0 0 82 55" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} strokeDasharray="3,3"/>}
      </HumanFace>
    );
  }

  if (id === 2) {
    return (
      <HumanFace pointY={115}>
        <motion.g animate={isActive ? { y: [0, 4, 0] } : { y: 0 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <IndexFingerDown x={70} y={68} />
        </motion.g>
        {isActive && [[-8,0],[-6,4],[6,4],[8,0]].map(([dx,dy],i) => (
          <motion.line key={i} x1={70+dx} y1={115+dy} x2={70+dx*1.6} y2={115+dy*1.6+4}
            stroke={color} strokeWidth={1.5} strokeLinecap="round"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i*0.12 }} />
        ))}
      </HumanFace>
    );
  }

  if (id === 3) {
    return (
      <HumanFace pointY={134}>
        <motion.g animate={isActive ? { y: [0, 4, 0] } : { y: 0 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <IndexFingerDown x={70} y={88} />
        </motion.g>
        {isActive && [[-8,0],[8,0],[-5,-6],[5,-6]].map(([dx,dy],i) => (
          <motion.line key={i} x1={70+dx} y1={134+dy} x2={70+dx*1.8} y2={134+dy*1.8}
            stroke={color} strokeWidth={1.5} strokeLinecap="round"
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i*0.15 }} />
        ))}
      </HumanFace>
    );
  }

  if (id === 4) {
    return (
      <svg viewBox="0 0 160 140" className="w-full h-full">
        <path d="M10 55 Q14 45 30 44 L120 44 Q135 44 148 52 Q152 60 148 70 Q135 78 120 78 L30 78 Q14 79 10 70 Z"
          fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M10 62 Q14 50 30 49 L120 49 Q133 49 147 57" stroke={S.skinL} strokeWidth={4} fill="none" opacity={0.5}/>
        <path d="M108 44 Q110 61 108 78" stroke={S.skinD} strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M114 44 Q116 61 114 78" stroke={S.skinD} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5}/>
        <path d="M88 78 L84 44" stroke={S.vein} strokeWidth={1} strokeDasharray="3,3" opacity={0.6}/>
        <path d="M100 78 L98 44" stroke={S.vein} strokeWidth={1} strokeDasharray="3,3" opacity={0.6}/>
        <ellipse cx={138} cy={61} rx={16} ry={18} fill={S.skin} stroke={S.skinD} strokeWidth={1}/>
        {[0,1,2,3].map(i => (
          <g key={i} transform={`translate(${148+i*2}, ${50+i*5})`}>
            <rect x={0} y={0} width={14} height={8} rx={4} fill={S.skin} stroke={S.skinD} strokeWidth={0.8}/>
          </g>
        ))}
        <path d="M130 75 Q136 80 145 82 Q152 83 155 78" stroke={S.skin} strokeWidth={8} strokeLinecap="round" fill="none"/>
        <path d="M130 75 Q136 80 145 82 Q152 83 155 78" stroke={S.skinD} strokeWidth={1} fill="none"/>
        <g transform="translate(68, 82)">
          {[0,1,2].map(i => (
            <rect key={i} x={i*12} y={0} width={10} height={14} rx={5} fill="none" stroke={color} strokeWidth={1.5} opacity={0.6}/>
          ))}
          <text x={16} y={22} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">3 dedos</text>
        </g>
        <line x1={68} y1={88} x2={68} y2={78} stroke={color} strokeWidth={1} opacity={0.5}/>
        <line x1={104} y1={88} x2={108} y2={78} stroke={color} strokeWidth={1} opacity={0.5}/>
        <motion.g animate={isActive ? { y: [0, 5, 0] } : { y: 0 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx={86} cy={38} rx={9} ry={7} fill={S.skinD}/>
          <rect x={78} y={16} width={16} height={24} rx={7} fill={S.skin} stroke={S.skinD} strokeWidth={1}/>
          <rect x={80} y={18} width={12} height={10} rx={4} fill={S.nail} stroke={S.skinD} strokeWidth={0.5}/>
          <path d="M76 16 Q68 8 66 0 Q70 -4 76 0 L82 16Z" fill={S.skin}/>
          <path d="M90 16 Q98 8 100 0 Q96 -4 90 0 L84 16Z" fill={S.skin}/>
        </motion.g>
        <PulseRings cx={86} cy={61} color={color} active={isActive} />
        {isActive && (
          <motion.text x={86} y={110} textAnchor="middle" fontSize={9} fill={color} fontWeight="bold"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
            3s → solte → repita
          </motion.text>
        )}
      </svg>
    );
  }

  if (id === 5) {
    return (
      <svg viewBox="0 0 140 170" className="w-full h-full">
        <path d="M22 95 Q14 78 16 62 Q18 50 26 48 Q36 46 40 60 L42 90Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M26 60 Q28 52 32 50" stroke={S.skinL} strokeWidth={2} fill="none" opacity={0.5}/>
        <path d="M42 90 L40 36 Q40 24 48 22 Q56 22 58 34 L58 90Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M60 90 L58 28 Q58 16 66 14 Q74 14 76 26 L76 90Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M78 90 L76 34 Q76 22 84 22 Q92 22 92 34 L92 90Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M94 90 L92 50 Q92 40 99 40 Q106 40 106 50 L106 90Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M22 95 L22 130 Q22 148 70 150 Q118 148 118 130 L118 95 Q114 90 106 90 L94 90 L78 90 L60 90 L42 90 Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <ellipse cx={70} cy={118} rx={36} ry={26} fill={S.skinD} opacity={0.2}/>
        <path d="M30 108 Q60 100 100 110" stroke={S.skinD} strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d="M36 122 Q58 132 84 126 Q100 120 108 116" stroke={S.skinD} strokeWidth={1.5} fill="none" strokeLinecap="round"/>
        {[[49,70],[67,64],[84,70],[99,72]].map(([x,y],i) => (
          <path key={i} d={`M${x-5} ${y} Q${x} ${y-4} ${x+5} ${y}`} stroke={S.skinD} strokeWidth={1.5} fill="none"/>
        ))}
        {[[49,26],[67,18],[84,26],[100,44]].map(([x,y],i) => (
          <rect key={i} x={x-5} y={y} width={10} height={12} rx={4} fill={S.nail} stroke={S.skinD} strokeWidth={0.5}/>
        ))}
        <motion.g animate={isActive ? { rotate: [0, 15, 0, -15, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '70px 100px' }}>
          <motion.g animate={isActive ? { y: [0, 4, 0] } : { y: 0 }} transition={{ duration: 2, repeat: Infinity }}>
            <ellipse cx={70} cy={105} rx={9} ry={8} fill={S.skinD}/>
            <rect x={62} y={78} width={16} height={28} rx={7} fill={S.skin} stroke={S.skinD} strokeWidth={1}/>
            <rect x={64} y={80} width={12} height={12} rx={4} fill={S.nail} stroke={S.skinD} strokeWidth={0.5}/>
            <path d="M62 90 Q54 82 52 74 Q56 68 62 74 L64 90Z" fill={S.skin}/>
            <path d="M78 90 Q86 82 88 74 Q84 68 78 74 L76 90Z" fill={S.skin}/>
          </motion.g>
        </motion.g>
        <PulseRings cx={70} cy={112} color={color} active={isActive} />
        {isActive && (
          <motion.path d="M56 112 A16 16 0 1 1 55 120" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
            animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '70px 112px' }} />
        )}
      </svg>
    );
  }

  if (id === 6) {
    return (
      <svg viewBox="0 0 170 130" className="w-full h-full">
        <path d="M68 0 Q58 2 56 18 L56 55 Q62 62 85 62 Q108 62 114 55 L114 18 Q112 2 102 0 Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M72 55 L68 8" stroke={S.skinD} strokeWidth={1.5} opacity={0.4}/>
        <path d="M98 55 L102 8" stroke={S.skinD} strokeWidth={1.5} opacity={0.4}/>
        <path d="M28 64 Q60 58 85 62 Q110 58 142 64" stroke={S.skinD} strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M56 22 Q38 30 16 55 Q8 66 12 78 L52 88 Q58 78 58 60Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M114 22 Q132 30 154 55 Q162 66 158 78 L118 88 Q112 78 112 60Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M20 62 Q40 56 56 50" stroke={S.skinL} strokeWidth={5} fill="none" opacity={0.4}/>
        <path d="M150 62 Q130 56 114 50" stroke={S.skinL} strokeWidth={5} fill="none" opacity={0.4}/>
        <PulseRings cx={136} cy={46} color={color} active={isActive} />
        <motion.g animate={isActive ? { scaleY: [1, 0.88, 1] } : {}} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '136px 46px' }}>
          <path d="M118 58 Q126 56 136 58 Q146 56 154 58 Q150 68 136 70 Q122 68 118 58Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.2}/>
          <path d="M128 60 Q136 58 144 60 Q140 66 136 66 Q132 66 128 60Z" fill={S.nail} opacity={0.7}/>
          <path d="M118 36 Q126 34 136 36 Q146 34 154 36 Q150 46 136 48 Q122 46 118 36Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.2}/>
          <path d="M128 38 Q136 36 144 38 Q140 44 136 44 Q132 44 128 38Z" fill={S.nail} opacity={0.7}/>
        </motion.g>
        {isActive && (
          <>
            <motion.path d="M116 46 L110 46" stroke={color} strokeWidth={2} strokeLinecap="round" animate={{ x: [-2, 2, -2] }} transition={{ duration: 0.45, repeat: Infinity }} />
            <motion.path d="M156 46 L162 46" stroke={color} strokeWidth={2} strokeLinecap="round" animate={{ x: [2, -2, 2] }} transition={{ duration: 0.45, repeat: Infinity }} />
          </>
        )}
        <text x={85} y={115} textAnchor="middle" fontSize={9} fill={color} fontWeight="bold" opacity={0.7}>Trapézio — beliscar o músculo</text>
      </svg>
    );
  }

  if (id === 7) {
    return (
      <svg viewBox="0 0 140 190" className="w-full h-full">
        <path d="M36 0 Q28 2 26 14 L26 68 Q26 80 70 82 Q114 80 114 68 L114 14 Q112 2 104 0 Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M30 12 Q50 8 70 8 Q90 8 110 12" stroke={S.skinL} strokeWidth={4} fill="none" opacity={0.4}/>
        <ellipse cx={70} cy={92} rx={28} ry={20} fill={S.skinL} stroke={S.skinD} strokeWidth={2}/>
        <ellipse cx={70} cy={92} rx={18} ry={13} fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M56 86 Q70 82 84 86" stroke="white" strokeWidth={2} opacity={0.4} fill="none"/>
        <path d="M42 108 Q36 110 36 124 L36 186 Q36 190 70 190 Q104 190 104 186 L104 124 Q104 110 98 108Z" fill={S.skin} stroke={S.skinD} strokeWidth={1.5}/>
        <path d="M70 108 L70 186" stroke={S.skinL} strokeWidth={4} opacity={0.35}/>
        <path d="M95 112 L98 182" stroke={S.skinD} strokeWidth={1} opacity={0.25}/>
        <g>
          {[0,1,2,3].map(i => (
            <rect key={i} x={106} y={108+i*12} width={10} height={10} rx={5} fill="none" stroke={color} strokeWidth={1.2} opacity={0.5}/>
          ))}
          <text x={111} y={162} textAnchor="middle" fontSize={7} fill={color} fontWeight="bold">4×</text>
        </g>
        <line x1={104} y1={108} x2={104} y2={156} stroke={color} strokeWidth={1} opacity={0.4}/>
        <PulseRings cx={92} cy={132} color={color} active={isActive} />
        <motion.g animate={isActive ? { x: [0, 8, 0] } : { x: 0 }} transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx={60} cy={132} rx={9} ry={7} fill={S.skinD}/>
          <rect x={60} y={126} width={22} height={12} rx={6} fill={S.skin} stroke={S.skinD} strokeWidth={1}/>
          <rect x={62} y={128} width={12} height={8} rx={3} fill={S.nail} stroke={S.skinD} strokeWidth={0.5}/>
          <path d="M82 126 Q92 118 94 110 Q90 106 84 112 L80 126Z" fill={S.skin}/>
          <path d="M82 138 Q92 146 94 154 Q90 158 84 152 L80 138Z" fill={S.skin}/>
        </motion.g>
        {isActive && [0,1,2].map(i => (
          <motion.line key={i} x1={78} y1={128+i*4} x2={88} y2={128+i*4}
            stroke={color} strokeWidth={1.5} strokeLinecap="round"
            animate={{ opacity: [0, 1, 0], x1: [78, 72, 78] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: i*0.1 }} />
        ))}
      </svg>
    );
  }

  return null;
}

function TechniqueGuide({ technique, color }: { technique: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
        {technique === 'circular' && (
          <motion.div className="w-4 h-4 rounded-full border-2 border-t-transparent"
            style={{ borderColor: color, borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
        )}
        {(technique === 'static') && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }} />
        )}
        {technique === 'pulsating' && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ scale: [1, 1.7, 1, 1.7, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }} />
        )}
        {technique === 'tapping' && (
          <motion.div className="w-2.5 h-2.5 rounded-full" style={{ background: color }}
            animate={{ y: [0, -5, 0] }} transition={{ duration: 0.38, repeat: Infinity }} />
        )}
        {technique === 'friction' && (
          <motion.div className="w-3 h-3 rounded-full" style={{ background: color }}
            animate={{ x: [-4, 4, -4] }} transition={{ duration: 0.44, repeat: Infinity }} />
        )}
      </div>
      <span className="text-xs font-semibold text-gray-500">
        {technique === 'circular'  && 'Movimentos circulares lentos'}
        {technique === 'static'    && 'Pressão firme e constante'}
        {technique === 'pulsating' && 'Pressiona 3s → solta → repete'}
        {technique === 'tapping'   && 'Batidinhas rítmicas suaves'}
        {technique === 'friction'  && 'Aperto em pinça no músculo'}
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
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (circumference * ((point.duration - timeLeft) / point.duration));

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

      <div className="flex gap-1.5 justify-center mb-5">
        {POINTS.map((_, i) => (
          <motion.div key={i} className="h-1.5 rounded-full"
            animate={{ width: i === step ? 24 : 8, background: i < step ? '#10b981' : i === step ? point.color : '#e5e7eb' }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">

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

          <motion.div className="mx-auto mb-3" style={{ width: 170, height: 170 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            <PointSVG id={point.id} color={point.color} isActive={isRunning} />
          </motion.div>

          <div className="flex justify-center mb-3">
            <TechniqueGuide technique={point.technique} color={point.color} />
          </div>

          <div className="rounded-2xl p-3.5 mb-4 text-center" style={{ background: point.bg }}>
            <p className="text-sm font-semibold text-[#1e293b] leading-snug">{point.instruction}</p>
          </div>

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
                    <circle cx={48} cy={48} r={44} fill="none" stroke={point.color} strokeWidth={5}
                      strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }} />
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
