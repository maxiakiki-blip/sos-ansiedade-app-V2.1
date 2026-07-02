import React from 'react';

/**
 * Fondo "aurora": blobs de gradiente que respiran lento detrás del contenido.
 * - Puro CSS (GPU, sin JS por frame)
 * - Se apaga con prefers-reduced-motion
 * - Se atenúa automáticamente en dark mode (via .dark en <html>)
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <style>{`
        .aurora-bg { position: fixed; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }
        .aurora-blob { position: absolute; border-radius: 50%; filter: blur(60px); will-change: transform; }
        .aurora-1 { width: 340px; height: 340px; top: -120px; left: -100px;
          background: radial-gradient(circle, rgba(201,166,232,0.55), transparent 70%);
          animation: aurora-drift-1 14s ease-in-out infinite alternate; }
        .aurora-2 { width: 300px; height: 300px; top: 30%; right: -120px;
          background: radial-gradient(circle, rgba(155,208,245,0.45), transparent 70%);
          animation: aurora-drift-2 18s ease-in-out infinite alternate; }
        .aurora-3 { width: 280px; height: 280px; bottom: -80px; left: 20%;
          background: radial-gradient(circle, rgba(168,216,200,0.4), transparent 70%);
          animation: aurora-drift-3 16s ease-in-out infinite alternate; }
        @keyframes aurora-drift-1 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,30px) scale(1.15); } }
        @keyframes aurora-drift-2 { from { transform: translate(0,0) scale(1.1); } to { transform: translate(-35px,-25px) scale(0.95); } }
        @keyframes aurora-drift-3 { from { transform: translate(0,0) scale(0.95); } to { transform: translate(30px,-30px) scale(1.12); } }
        .dark .aurora-1 { background: radial-gradient(circle, rgba(74,53,104,0.5), transparent 70%); }
        .dark .aurora-2 { background: radial-gradient(circle, rgba(42,69,96,0.45), transparent 70%); }
        .dark .aurora-3 { background: radial-gradient(circle, rgba(38,74,66,0.4), transparent 70%); }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
    </div>
  );
}

