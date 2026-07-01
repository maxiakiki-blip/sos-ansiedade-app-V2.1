import React from 'react';

interface TappingPointSVGProps {
  pointId: number;
  techniqueId: string;
  active: boolean;
}

export default function TappingPointSVG({ pointId, techniqueId, active }: TappingPointSVGProps) {
  let animStyle: React.CSSProperties = {};
  if (active) {
    if (techniqueId === 'circular') animStyle = { animation: 'anim-circular 2s linear infinite' };
    if (techniqueId === 'vertical') animStyle = { animation: 'anim-vertical 1.5s ease-in-out infinite' };
    if (techniqueId === 'horizontal') animStyle = { animation: 'anim-horizontal 1.5s ease-in-out infinite' };
    if (techniqueId === 'pulsating') animStyle = { animation: 'anim-pulsating 3s ease-in-out infinite' };
    if (techniqueId === 'tapping') animStyle = { animation: 'anim-tapping 0.4s ease-in-out infinite' };
    if (techniqueId === 'friction') animStyle = { animation: 'anim-friction 0.5s ease-in-out infinite' };
  }

  const renderGuides = (cx: number, cy: number, rCirc: number) => (
    <>
      {active && techniqueId === 'circular' && (
        <path d={`M ${cx} ${cy - rCirc} A ${rCirc} ${rCirc} 0 1 1 ${cx - 0.1} ${cy - rCirc}`} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
      )}
      {active && techniqueId === 'vertical' && (
        <path d={`M ${cx} ${cy - 12} L ${cx} ${cy + 12}`} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
      )}
      {active && techniqueId === 'horizontal' && (
        <path d={`M ${cx - 12} ${cy} L ${cx + 12} ${cy}`} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
      )}
    </>
  );

  const renderActivePoint = (cx: number, cy: number) => (
    <g style={animStyle}>
       <circle cx={cx} cy={cy} r="3" fill="#f43f5e" />
       {active && techniqueId === 'static' && (
         <circle cx={cx} cy={cy} r="10" fill="#f43f5e" opacity="0.4" className="animate-ping" />
       )}
       {active && techniqueId !== 'static' && (
         <circle cx={cx} cy={cy} r="7" fill="#f43f5e" opacity="0.3" />
       )}
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      {(pointId === 1 || pointId === 2 || pointId === 3) && (
        // --- ROSTRO (Puntos 1, 2, 3) ---
        <>
          <path d="M 25 45 Q 25 85 50 90 Q 75 85 75 45 Q 75 15 50 15 Q 25 15 25 45" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 33 46 Q 38 49 43 46" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 57 46 Q 62 49 67 46" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 31 38 Q 37 36 44 39" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 69 38 Q 63 36 56 39" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50 45 L 50 58 L 47 60" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 42 72 Q 50 74 58 72" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          
          {pointId === 1 && renderActivePoint(50, 38.5)}
          {pointId === 1 && renderGuides(50, 38.5, 7.5)}
          {pointId === 2 && renderActivePoint(50, 64)}
          {pointId === 2 && renderGuides(50, 64, 4)}
          {pointId === 3 && renderActivePoint(50, 78)}
          {pointId === 3 && renderGuides(50, 78, 6)}
        </>
      )}

      {pointId === 4 && (
        // --- MUÑECA/BRAZO (Punto 4) ---
        <>
          <path d="M 35 10 L 35 100" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 65 10 L 65 100" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 35 40 Q 50 45 65 40" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 37 43 Q 50 48 63 43" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.6"/>
          <path d="M 46 45 L 46 100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
          <path d="M 54 45 L 54 100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
          
          {renderActivePoint(50, 65)}
        </>
      )}

      {pointId === 5 && (
        // --- PALMA DE LA MANO (Punto 5) ---
        <>
           <path d="M 35 90 L 35 60 Q 25 50 25 40 Q 25 35 30 35 Q 35 35 38 45 L 40 25 Q 40 20 45 20 Q 50 20 50 30 L 52 15 Q 52 10 57 10 Q 62 10 62 25 L 64 25 Q 64 20 69 20 Q 74 20 74 35 L 74 60 Q 70 80 65 90 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
           <path d="M 35 60 Q 50 55 65 65" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.5" />
           <path d="M 45 45 Q 55 60 55 80" fill="none" stroke="#94a3b8" strokeWidth="1.5" opacity="0.5" />
           
           {renderActivePoint(50, 52)}
           {renderGuides(50, 52, 8)}
        </>
      )}

      {pointId === 6 && (
        // --- HOMBRO / CUELLO (Punto 6) ---
        <>
           <path d="M 35 0 L 35 15 Q 35 30 20 45 L 0 45 L 0 100 L 100 100 L 100 45 L 80 45 Q 65 30 65 15 L 65 0" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
           <path d="M 50 15 L 50 45" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
           
           {renderActivePoint(72, 40)}
           {renderGuides(72, 40, 8)}
        </>
      )}

      {pointId === 7 && (
        // --- RODILLA / PIERNA (Punto 7) ---
        <>
           <path d="M 30 20 L 30 40 Q 25 55 30 75 L 30 100 M 70 20 L 70 40 Q 75 55 70 75 L 65 100" fill="none" stroke="#cbd5e1" strokeWidth="2" />
           <ellipse cx="50" cy="35" rx="12" ry="15" fill="none" stroke="#94a3b8" strokeWidth="2" />
           <path d="M 50 50 L 50 100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6" />
           
           {renderActivePoint(63, 60)}
           {renderGuides(63, 60, 6)}
        </>
      )}
    </svg>
  );
}
