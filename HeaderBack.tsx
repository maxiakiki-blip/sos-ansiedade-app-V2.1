import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
}

const COLORS = ['#b388c4', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

export default function ConfettiEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const p: Particle[] = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      angle: Math.random() * 360,
      speed: 80 + Math.random() * 160,
      rotation: Math.random() * 720 - 360,
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2200);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fly-${p.id % 4} 2s ease-out forwards`,
            transform: `translate(-50%, -50%) rotate(0deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fly-0 {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${Math.random()*200-100}px), calc(-50% + ${80+Math.random()*120}px)) rotate(360deg) scale(0); opacity: 0; }
        }
        @keyframes confetti-fly-1 {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${Math.random()*200-100}px), calc(-50% + ${80+Math.random()*120}px)) rotate(-540deg) scale(0); opacity: 0; }
        }
        @keyframes confetti-fly-2 {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${Math.random()*200-100}px), calc(-50% + ${80+Math.random()*120}px)) rotate(720deg) scale(0); opacity: 0; }
        }
        @keyframes confetti-fly-3 {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + ${Math.random()*200-100}px), calc(-50% + ${80+Math.random()*120}px)) rotate(-360deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
