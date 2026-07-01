import React, { useState } from 'react';
import { Hand, Trash2, Music, Sparkles } from 'lucide-react';
import TappingExercise from './TappingExercise';
import WorryBox from './WorryBox';
import CalmingSounds from './CalmingSounds';
import MotivationalQuotes from './MotivationalQuotes';

interface TabPrevencionProps {
  logActivity: (activity: string) => void;
  logMood: (mood: string) => void;
  currentMood?: string;
}

const MOODS = [
  { id: 'muy_ansioso', emoji: '😫', label: 'Ansioso',   color: '#ef4444', bg: '#fff1f2' },
  { id: 'inquieto',   emoji: '😕', label: 'Inquieto',  color: '#f59e0b', bg: '#fffbeb' },
  { id: 'tranquilo',  emoji: '🙂', label: 'Tranquilo', color: '#10b981', bg: '#ecfdf5' },
  { id: 'genial',     emoji: '😌', label: 'Ótimo',     color: '#3b82f6', bg: '#eff6ff' },
];

const MODULES = [
  {
    id: 'tapping',
    title: 'Acupressão',
    subtitle: '7 Pontos Clínicos',
    desc: 'Guia anatômico de pontos de acupressão',
    icon: <Hand className="w-6 h-6 text-white" />,
    gradient: 'linear-gradient(135deg, #34d399, #10b981)',
    xp: '+35 XP',
    xpBg: '#ecfdf5',
    xpColor: '#10b981',
  },
  {
    id: 'caja',
    title: 'Caixa de',
    subtitle: 'Preocupações',
    desc: 'Dissolva e liberte o que te preocupa',
    icon: <Trash2 className="w-6 h-6 text-white" />,
    gradient: 'linear-gradient(135deg, #f87171, #ef4444)',
    xp: '+25 XP',
    xpBg: '#fff1f2',
    xpColor: '#ef4444',
  },
  {
    id: 'sonidos',
    title: 'Sons',
    subtitle: 'Relaxantes',
    desc: 'Frequências solfeggio e binaurais',
    icon: <Music className="w-6 h-6 text-white" />,
    gradient: 'linear-gradient(135deg, #818cf8, #6366f1)',
    xp: '+20 XP',
    xpBg: '#eef2ff',
    xpColor: '#6366f1',
  },
  {
    id: 'frases',
    title: 'Dose de',
    subtitle: 'Motivação',
    desc: 'Reenquadramentos cognitivos positivos',
    icon: <Sparkles className="w-6 h-6 text-white" />,
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    xp: '+15 XP',
    xpBg: '#fffbeb',
    xpColor: '#f59e0b',
  },
];

export default function TabPrevencion({ logActivity, logMood, currentMood }: TabPrevencionProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  if (activeModule === 'tapping') return <TappingExercise onBack={() => setActiveModule(null)} logActivity={logActivity} />;
  if (activeModule === 'caja')    return <WorryBox onBack={() => setActiveModule(null)} logActivity={logActivity} />;
  if (activeModule === 'sonidos') return <CalmingSounds onBack={() => setActiveModule(null)} logActivity={logActivity} />;
  if (activeModule === 'frases')  return <MotivationalQuotes onBack={() => setActiveModule(null)} logActivity={logActivity} />;

  const activeMood = MOODS.find(m => m.id === currentMood);

  return (
    <div className="animate-in fade-in duration-300">

      {/* MOOD TRACKER */}
      <div className="rounded-3xl p-5 mb-6 relative overflow-hidden border border-white/60 shadow-sm"
        style={{ background: 'linear-gradient(135deg, rgba(179,136,196,0.08), rgba(255,255,255,0.9))' }}>
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #b388c4, transparent)' }} />

        <h3 className="font-black text-[#1e293b] mb-1 text-sm relative z-10">Como você está hoje?</h3>
        {activeMood && (
          <p className="text-[10px] font-bold mb-3 relative z-10" style={{ color: activeMood.color }}>
            Sentindo-se {activeMood.label} {activeMood.emoji}
          </p>
        )}
        {!activeMood && <p className="text-[10px] text-gray-400 font-medium mb-3 relative z-10">Registre seu humor para acompanhar sua evolução</p>}

        <div className="flex gap-2 relative z-10">
          {MOODS.map(m => {
            const isActive = currentMood === m.id;
            return (
              <button key={m.id} onClick={() => logMood(m.id)}
                className="flex-1 flex flex-col items-center py-3 rounded-2xl border transition-all duration-200 active:scale-95"
                style={{
                  background: isActive ? m.color : m.bg,
                  borderColor: isActive ? m.color : 'transparent',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? `0 4px 12px ${m.color}40` : 'none',
                }}>
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[10px] font-black" style={{ color: isActive ? 'white' : m.color }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-xl font-black text-[#1e293b] mb-1">Hábitos Preventivos</h2>
        <p className="text-gray-400 text-xs font-medium">A prática diária fortalece o sistema parassimpático e reduz picos de ansiedade.</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {MODULES.map(mod => (
          <button key={mod.id} onClick={() => setActiveModule(mod.id)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left active:scale-[0.97] transition-transform hover:shadow-md group">
            {/* Gradient banner */}
            <div className="h-20 flex items-center justify-center relative overflow-hidden"
              style={{ background: mod.gradient }}>
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)' }} />
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                {mod.icon}
              </div>
            </div>
            <div className="p-3.5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 leading-none">{mod.title}</p>
                  <h3 className="font-black text-sm text-[#1e293b] leading-tight">{mod.subtitle}</h3>
                </div>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: mod.xpBg, color: mod.xpColor }}>
                  {mod.xp}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">{mod.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Tip card */}
      <div className="mt-6 rounded-2xl p-5 border"
        style={{ background: 'linear-gradient(135deg, #F5EFFF, #EDE0F5)', borderColor: 'rgba(179,136,196,0.25)' }}>
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }}>
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="font-black text-[#1e293b] text-xs mb-1">Dica do Dia</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pratique pelo menos 2 atividades por dia. Consistência é mais poderosa do que intensidade para manter a ansiedade sob controle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
