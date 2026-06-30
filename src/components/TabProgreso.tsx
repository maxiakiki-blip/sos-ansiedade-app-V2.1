import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, Calendar, Trophy, Star, Flame, Lock } from 'lucide-react';
import { GamificationState, ALL_BADGES, getLevelInfo, getNextLevel, LEVELS } from '../types';

interface TabProgresoProps {
  logs: Record<string, string[]>;
  moods: Record<string, string>;
  gamification: GamificationState;
}

const MOOD_EMOJIS: Record<string, string> = { muy_ansioso: '😫', inquieto: '😕', tranquilo: '🙂', genial: '😌' };
const MOOD_LABELS: Record<string, string> = { muy_ansioso: 'Ansioso(a)', inquieto: 'Inquieto(a)', tranquilo: 'Tranquilo(a)', genial: 'Excelente' };
const MOOD_SCORE: Record<string, number> = { muy_ansioso: 1, inquieto: 2, tranquilo: 3, genial: 4 };
const MOOD_COLOR: Record<string, string> = { muy_ansioso: '#ef4444', inquieto: '#f59e0b', tranquilo: '#10b981', genial: '#3b82f6' };

export default function TabProgreso({ logs, moods, gamification }: TabProgresoProps) {
  const [view, setView] = useState<'stats' | 'badges' | 'calendar'>('stats');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayActivities = logs[todayStr] || [];
  const todayMood = moods[todayStr];

  const levelInfo = getLevelInfo(gamification.xp);
  const nextLevel = getNextLevel(gamification.xp);
  const xpProgress = nextLevel
    ? ((gamification.xp - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100
    : 100;

  // Weekly data for chart
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    const dateStr = local.toISOString().split('T')[0];
    return {
      label: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()],
      dateStr,
      actCount: (logs[dateStr] || []).length,
      mood: moods[dateStr],
      isToday: dateStr === todayStr,
    };
  });
  const maxAct = Math.max(1, ...weekDays.map(d => d.actCount));

  const totalDaysActive = Object.keys(logs).length;
  const totalActivities = Object.values(logs).flat().length;

  // Calendar
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    const dateStr = local.toISOString().split('T')[0];
    return { n: i + 1, dateStr, isToday: dateStr === todayStr };
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-5">
        <h2 className="text-xl font-black text-[#1e293b] mb-1">Sua Evolução</h2>
        <p className="text-gray-400 text-xs font-medium">Acompanhe seu progresso, conquistas e bem-estar emocional.</p>
      </div>

      {/* LEVEL CARD */}
      <div className="rounded-3xl p-5 mb-5 border border-white/40 shadow-md overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${levelInfo.bg}, white)` }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30"
          style={{ background: levelInfo.color }} />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${levelInfo.color}dd, ${levelInfo.color})` }}>
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nível Atual</p>
              <span className="text-[11px] font-black" style={{ color: levelInfo.color }}>{gamification.xp} XP</span>
            </div>
            <h3 className="font-black text-lg text-[#1e293b] leading-tight">{levelInfo.name}</h3>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(3, xpProgress)}%`, background: `linear-gradient(90deg, ${levelInfo.color}88, ${levelInfo.color})` }} />
            </div>
            {nextLevel && <p className="text-[9px] text-gray-400 font-bold mt-1">→ {nextLevel.name} em {nextLevel.min - gamification.xp} XP</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4 relative z-10">
          {[
            { icon: <Flame className="w-4 h-4" />, label: 'Racha', value: gamification.streak, color: '#f97316', bg: '#fff7ed' },
            { icon: <Star className="w-4 h-4" />, label: 'Dias Ativos', value: totalDaysActive, color: '#b388c4', bg: '#F5EFFF' },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Atividades', value: totalActivities, color: '#10b981', bg: '#ecfdf5' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center border border-white/60"
              style={{ background: s.bg }}>
              <div className="flex justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] text-gray-400 font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-5 shadow-inner">
        {([['stats', '📊 Semana'], ['badges', '🏆 Conquistas'], ['calendar', '📅 Calendário']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setView(v)}
            className="flex-1 py-2 text-[11px] font-black rounded-xl transition-all"
            style={view === v ? { background: 'white', color: '#b388c4', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
            {l}
          </button>
        ))}
      </div>

      {/* STATS VIEW */}
      {view === 'stats' && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          {/* Weekly mood chart */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-black text-sm text-[#1e293b] mb-4">Atividade e Humor — Últimos 7 Dias</h3>
            <div className="flex items-end justify-between gap-1 h-28">
              {weekDays.map((day, i) => {
                const barH = day.actCount > 0 ? Math.max(12, (day.actCount / maxAct) * 80) : 0;
                const moodColor = day.mood ? MOOD_COLOR[day.mood] : '#e5e7eb';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    {day.mood && <span className="text-lg">{MOOD_EMOJIS[day.mood]}</span>}
                    {!day.mood && <span className="text-lg opacity-20">·</span>}
                    <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                      {day.actCount > 0 ? (
                        <div className="w-full rounded-lg transition-all duration-500"
                          style={{
                            height: `${barH}px`,
                            background: day.isToday
                              ? 'linear-gradient(180deg, #b388c4, #9d6eb5)'
                              : `linear-gradient(180deg, ${moodColor}88, ${moodColor}44)`,
                          }} />
                      ) : (
                        <div className="w-full h-1.5 rounded-full bg-gray-100" />
                      )}
                    </div>
                    <span className="text-[9px] font-black uppercase"
                      style={{ color: day.isToday ? '#b388c4' : '#94a3b8' }}>{day.label}</span>
                    {day.actCount > 0 && <span className="text-[8px] font-bold text-gray-400">{day.actCount}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's detail */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm text-[#1e293b]">Hoje</h3>
              {todayMood && (
                <span className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: MOOD_COLOR[todayMood] + '15', color: MOOD_COLOR[todayMood] }}>
                  {MOOD_EMOJIS[todayMood]} {MOOD_LABELS[todayMood]}
                </span>
              )}
            </div>
            {todayActivities.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-3xl mb-2">🌱</p>
                <p className="text-xs text-gray-400 font-medium">Nenhuma atividade hoje ainda.</p>
                <p className="text-[11px] text-gray-300 mt-1">Comece pela aba Resgate ou Prevenção!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {todayActivities.map((act, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs p-3 rounded-xl border"
                    style={{ background: '#F5EFFF', borderColor: 'rgba(179,136,196,0.2)' }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-bold text-[#1e293b]">{act}</span>
                    <span className="ml-auto text-[10px] font-black text-[#b388c4]">+{({ 'Respiração Tática': 30, 'Conexão Sensorial 5-4-3-2-1': 40, 'Abraço de Borboleta': 35, 'Acupressão (7 Pontos)': 35, 'Caixa de Preocupações': 25, 'Sons Relaxantes': 20, 'Leitura Motivacional': 15 } as any)[act] || 20} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* BADGES VIEW */}
      {view === 'badges' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 gap-3">
            {ALL_BADGES.map(badge => {
              const unlocked = gamification.unlockedBadgeIds.includes(badge.id);
              return (
                <div key={badge.id}
                  className="rounded-2xl p-4 border transition-all"
                  style={{
                    background: unlocked ? 'linear-gradient(135deg, #F5EFFF, white)' : '#f8fafc',
                    borderColor: unlocked ? 'rgba(179,136,196,0.3)' : '#e5e7eb',
                    opacity: unlocked ? 1 : 0.55,
                  }}>
                  <div className="flex items-start gap-2">
                    <span className="text-3xl" style={{ filter: unlocked ? 'none' : 'grayscale(100%)' }}>{badge.emoji}</span>
                    {!unlocked && <Lock className="w-3 h-3 text-gray-300 mt-1 flex-shrink-0" />}
                  </div>
                  <h4 className="font-black text-[11px] text-[#1e293b] mt-2 mb-1 leading-tight">{badge.name}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight">{badge.description}</p>
                  {unlocked && <span className="inline-block mt-2 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">✓ Conquistado</span>}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 font-medium">
              {gamification.unlockedBadgeIds.length} de {ALL_BADGES.length} conquistas desbloqueadas
            </p>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full"
                style={{
                  width: `${(gamification.unlockedBadgeIds.length / ALL_BADGES.length) * 100}%`,
                  background: 'linear-gradient(90deg, #b388c4, #a78bfa)',
                }} />
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === 'calendar' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-sm capitalize text-[#1e293b]">
              {today.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 text-gray-400 font-black uppercase">
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
            {monthDays.map(day => {
              const actCount = (logs[day.dateStr] || []).length;
              const dayMood = moods[day.dateStr];
              return (
                <div key={day.n} className="flex flex-col items-center justify-center aspect-square relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center relative"
                    style={{
                      background: actCount > 0 ? 'linear-gradient(135deg, #b388c4, #9d6eb5)' : '#f8fafc',
                      color: actCount > 0 ? 'white' : '#64748b',
                      fontWeight: day.isToday ? 900 : 500,
                      border: day.isToday ? '2px solid #b388c4' : '2px solid transparent',
                    }}>
                    <span className="text-[11px]">{day.n}</span>
                  </div>
                  {dayMood && (
                    <div className="absolute -top-1.5 -right-1 text-[10px] bg-white rounded-full shadow-sm border border-gray-100 p-[1px] z-10">
                      {MOOD_EMOJIS[dayMood]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #b388c4, #9d6eb5)' }} />
              <span className="text-[10px] text-gray-400 font-medium">Dia ativo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border-2 border-[#b388c4] bg-white" />
              <span className="text-[10px] text-gray-400 font-medium">Hoje</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
