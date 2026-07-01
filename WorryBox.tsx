import React, { useState } from 'react';
import { Wind, Hand, Play, Zap } from 'lucide-react';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import ButterflyHug from './ButterflyHug';

interface TabRescateProps {
  logActivity: (activity: string) => void;
}

export default function TabRescate({ logActivity }: TabRescateProps) {
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);

  if (activeEmergency === 'breathing') return <BreathingExercise onBack={() => setActiveEmergency(null)} logActivity={logActivity} onComplete={() => setActiveEmergency('grounding')} />;
  if (activeEmergency === 'grounding') return <GroundingExercise onBack={() => setActiveEmergency(null)} logActivity={logActivity} onComplete={() => setActiveEmergency('butterfly')} />;
  if (activeEmergency === 'butterfly') return <ButterflyHug onBack={() => setActiveEmergency(null)} logActivity={logActivity} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-300">
      <style>{`
        @keyframes ring-pulse-1 { 0%,100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.4); opacity: 0; } }
        @keyframes ring-pulse-2 { 0%,100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.7); opacity: 0; } }
        @keyframes ring-pulse-3 { 0%,100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(2.1); opacity: 0; } }
        @keyframes sos-glow { 0%,100% { box-shadow: 0 0 40px rgba(179,136,196,0.5), 0 16px 40px rgba(179,136,196,0.3); } 50% { box-shadow: 0 0 60px rgba(179,136,196,0.7), 0 16px 50px rgba(179,136,196,0.5); } }
        .ring-1 { animation: ring-pulse-1 2s ease-in-out infinite; }
        .ring-2 { animation: ring-pulse-2 2s ease-in-out infinite 0.4s; }
        .ring-3 { animation: ring-pulse-3 2s ease-in-out infinite 0.8s; }
        .sos-btn { animation: sos-glow 2.5s ease-in-out infinite; }
      `}</style>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Modo Emergência</span>
        </div>
        <h2 className="text-2xl font-black text-[#1e293b] mb-2">Está Sentindo Ansiedade?</h2>
        <p className="text-gray-400 text-sm px-6">Pressione o botão SOS para iniciar o protocolo de resgate imediato de 3 etapas.</p>
      </div>

      {/* MEGA SOS BUTTON */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Animated rings */}
        <div className="absolute w-44 h-44 rounded-full ring-1" style={{ background: 'radial-gradient(circle, rgba(179,136,196,0.3), transparent)' }} />
        <div className="absolute w-44 h-44 rounded-full ring-2" style={{ background: 'radial-gradient(circle, rgba(179,136,196,0.2), transparent)' }} />
        <div className="absolute w-44 h-44 rounded-full ring-3" style={{ background: 'radial-gradient(circle, rgba(179,136,196,0.15), transparent)' }} />

        <button
          onClick={() => setActiveEmergency('breathing')}
          className="relative w-44 h-44 rounded-full flex flex-col items-center justify-center text-white sos-btn active:scale-95 transition-transform border-4 border-white/30"
          style={{ background: 'linear-gradient(135deg, #c49fd4 0%, #b388c4 40%, #9d6eb5 100%)' }}
        >
          {/* Inner glow */}
          <div className="absolute inset-3 rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), transparent)' }} />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2 border border-white/30">
              <span className="text-3xl font-black tracking-tight">🆘</span>
            </div>
            <span className="font-black text-xl tracking-widest drop-shadow">S.O.S</span>
            <span className="text-[10px] font-black tracking-widest opacity-90 mt-0.5">INICIAR RESGATE</span>
          </div>
        </button>
      </div>

      {/* Exercise cards */}
      <div className="w-full space-y-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">ou escolha uma técnica específica</p>

        <button
          onClick={() => setActiveEmergency('breathing')}
          className="w-full rounded-2xl flex items-center justify-between p-4 active:scale-[0.98] transition-transform border shadow-sm hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #eff6ff, #fff)', borderColor: '#bfdbfe' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-[#1e293b] text-sm">Respiração Tática</h3>
                <span className="text-[9px] bg-blue-100 text-blue-600 font-black px-1.5 py-0.5 rounded-full">+30 XP</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Caixa de 4 seg: estabilize seu pulso</p>
            </div>
          </div>
          <Play className="w-5 h-5 text-blue-400 fill-current flex-shrink-0" />
        </button>

        <button
          onClick={() => setActiveEmergency('grounding')}
          className="w-full rounded-2xl flex items-center justify-between p-4 active:scale-[0.98] transition-transform border shadow-sm hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #ecfdf5, #fff)', borderColor: '#a7f3d0' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}>
              <Hand className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-[#1e293b] text-sm">Conexão Sensorial</h3>
                <span className="text-[9px] bg-emerald-100 text-emerald-600 font-black px-1.5 py-0.5 rounded-full">+40 XP</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Método 5-4-3-2-1: traga a mente ao presente</p>
            </div>
          </div>
          <Play className="w-5 h-5 text-emerald-400 fill-current flex-shrink-0" />
        </button>

        <button
          onClick={() => setActiveEmergency('butterfly')}
          className="w-full rounded-2xl flex items-center justify-between p-4 active:scale-[0.98] transition-transform border shadow-sm hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #F5EFFF, #fff)', borderColor: '#d8b4fe' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
              <span className="text-xl">🦋</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-[#1e293b] text-sm">Abraço de Borboleta</h3>
                <span className="text-[9px] bg-purple-100 text-purple-600 font-black px-1.5 py-0.5 rounded-full">+35 XP</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Estimulação bilateral EMDR: dissipe o alerta</p>
            </div>
          </div>
          <Play className="w-5 h-5 text-[#b388c4] fill-current flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
