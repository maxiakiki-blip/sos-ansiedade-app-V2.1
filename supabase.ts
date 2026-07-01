import React, { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import HeaderBack from './HeaderBack';

interface WorryBoxProps {
  onBack: () => void;
  logActivity: (activity: string) => void;
}

export default function WorryBox({ onBack, logActivity }: WorryBoxProps) {
  const [worry, setWorry] = useState('');
  const [phase, setPhase] = useState<'write' | 'burning' | 'done'>('write');

  const handleDestroy = () => {
    if (!worry.trim()) return;
    setPhase('burning');
    setTimeout(() => {
      setPhase('done');
      logActivity('Caixa de Preocupações');
    }, 1800);
  };

  const handleReset = () => {
    setWorry('');
    setPhase('write');
  };

  return (
    <div className="animate-in fade-in">
      <style>{`
        @keyframes burn-up { 0% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); } 30% { opacity: 0.7; transform: scale(0.98) translateY(-4px); filter: blur(1px); color: #ef4444; } 60% { opacity: 0.3; transform: scale(0.9) translateY(-12px); filter: blur(4px); } 100% { opacity: 0; transform: scale(0.7) translateY(-30px); filter: blur(8px); } }
        @keyframes flame-dance { 0%,100% { transform: scaleY(1) rotate(-2deg); } 33% { transform: scaleY(1.15) rotate(2deg); } 66% { transform: scaleY(0.9) rotate(-1deg); } }
        @keyframes spark { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
        .burning-text { animation: burn-up 1.8s ease-in forwards; }
        .flame { animation: flame-dance 0.4s ease-in-out infinite; }
      `}</style>

      <HeaderBack onBack={onBack} title="Caixa de Preocupações" />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header banner */}
        <div className="p-5 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff1f2, #fce7f3)' }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30"
            style={{ background: '#f87171' }} />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md relative z-10"
            style={{ background: 'linear-gradient(135deg, #f87171, #ef4444)' }}>
            <Flame className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-black text-[#1e293b] text-base relative z-10">Liberte o que te pesa</h3>
          <p className="text-xs text-gray-500 font-medium mt-1 relative z-10 leading-relaxed max-w-xs mx-auto">
            Escreva sua preocupação com honestidade. Ao queimar, seu cérebro recebe um sinal de liberação e alívio cognitivo.
          </p>
        </div>

        <div className="p-6">
          {phase === 'write' && (
            <>
              <textarea
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[140px] text-sm resize-none focus:outline-none transition-all"
                placeholder="Me sinto sobrecarregado(a) ao pensar em... / Sinto medo de... / Não consigo parar de pensar em..."
                value={worry}
                onChange={(e) => setWorry(e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#f87171'; e.target.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
              <p className="text-[10px] text-gray-400 font-medium mt-2 mb-4">
                {worry.length > 0 ? `${worry.length} caracteres escritos com coragem` : 'Escreva livremente — este espaço é só seu'}
              </p>
              <button
                onClick={handleDestroy}
                disabled={!worry.trim()}
                className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: worry.trim() ? 'linear-gradient(135deg, #f87171, #ef4444)' : '#e5e7eb', boxShadow: worry.trim() ? '0 6px 20px rgba(239,68,68,0.4)' : 'none' }}>
                <Flame className="w-5 h-5" /> Queimar e Libertar
              </button>
            </>
          )}

          {phase === 'burning' && (
            <div className="min-h-[200px] flex flex-col items-center justify-center relative">
              <div className="relative">
                <p className="burning-text text-sm text-gray-600 italic text-center max-w-xs leading-relaxed px-4">
                  "{worry}"
                </p>
              </div>
              <div className="mt-6 flex gap-1 items-end">
                {['🔥', '🔥', '🔥'].map((f, i) => (
                  <span key={i} className="flame text-3xl" style={{ animationDelay: `${i * 0.15}s`, animationDuration: `${0.35 + i * 0.08}s` }}>{f}</span>
                ))}
              </div>
              <p className="text-xs text-orange-500 font-black mt-3 uppercase tracking-widest animate-pulse">Queimando...</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}>
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h4 className="font-black text-xl text-[#1e293b] mb-2">Liberado! 🕊️</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
                Essa preocupação foi destruída. Ao escrever e soltar, você interrompeu o ciclo de ruminação. Sinta o leveza agora.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={handleReset}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                  Escrever Outra
                </button>
                <button onClick={onBack}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-95 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
