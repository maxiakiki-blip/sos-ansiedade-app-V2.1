import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, Calendar, Trophy, Star, Flame, Lock, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GamificationState, ALL_BADGES, BADGE_CATEGORIES, getLevelInfo, getNextLevel, LEVELS } from '../types';

interface TabProgresoProps {
  logs: Record<string, string[]>;
  moods: Record<string, string>;
  gamification: GamificationState;
  activityCounts: Record<string, Record<string, number>>;
}

const MOOD_EMOJIS: Record<string, string>  = { muy_ansioso: '😫', inquieto: '😕', tranquilo: '🙂', genial: '😌' };
const MOOD_LABELS: Record<string, string>  = { muy_ansioso: 'Ansioso(a)', inquieto: 'Inquieto(a)', tranquilo: 'Tranquilo(a)', genial: 'Excelente' };
const MOOD_COLOR: Record<string, string>   = { muy_ansioso: '#ef4444', inquieto: '#f59e0b', tranquilo: '#10b981', genial: '#3b82f6' };

const XP_TABLE: Record<string, number> = {
  'Respiração Tática': 30, 'Conexão Sensorial 5-4-3-2-1': 40, 'Abraço de Borboleta': 35,
  'Acupressão (7 Pontos)': 35, 'Caixa de Preocupações': 25, 'Sons Relaxantes': 20, 'Leitura Motivacional': 15,
};

const ACT_EMOJI: Record<string, string> = {
  'Respiração Tática': '🌬️', 'Conexão Sensorial 5-4-3-2-1': '🌱', 'Abraço de Borboleta': '🦋',
  'Acupressão (7 Pontos)': '✋', 'Caixa de Preocupações': '🗑️', 'Sons Relaxantes': '🎵', 'Leitura Motivacional': '✨',
};

const DAILY_MESSAGES = [
  'Cada respiração consciente é um passo para a paz.',
  'Você não precisa controlar tudo — só o próximo momento.',
  'Seu sistema nervoso merece cuidado diário.',
  'Pequenos hábitos criam grandes mudanças.',
  'Hoje é um novo começo. Você está aqui. Isso já é vitória.',
  'A consistência é mais poderosa que a intensidade.',
  'Cada exercício fortalece seu recurso interno.',
];

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export default function TabProgreso({ logs, moods, gamification, activityCounts }: TabProgresoProps) {
  const [view, setView] = useState<'stats' | 'badges' | 'calendar'>('stats');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayActivities = logs[todayStr] || [];
  const todayMood = moods[todayStr];
  const todayCounts = activityCounts[todayStr] || {};

  const levelInfo = getLevelInfo(gamification.xp);
  const nextLevel = getNextLevel(gamification.xp);
  const xpProgress = nextLevel
    ? ((gamification.xp - levelInfo.min) / (nextLevel.min - levelInfo.min)) * 100
    : 100;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    const dateStr = local.toISOString().split('T')[0];
    const dayCounts = activityCounts[dateStr] || {};
    const totalSessions = Object.values(dayCounts).reduce((a, b) => a + b, 0);
    return {
      label: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()],
      dateStr, uniqueActs: (logs[dateStr] || []).length, totalSessions,
      mood: moods[dateStr], isToday: dateStr === todayStr,
    };
  });
  const maxSessions = Math.max(1, ...weekDays.map(d => d.totalSessions));

  const totalDaysActive = Object.keys(logs).length;
  const totalUniqueSessions = Object.values(logs).flat().length;
  const totalRawSessions = Object.values(activityCounts)
    .flatMap(d => Object.values(d)).reduce((a, b) => a + b, 0);

  const weekSessions = weekDays.reduce((a, d) => a + d.totalSessions, 0);

  const allTimeCounts: Record<string, number> = {};
  Object.values(activityCounts).forEach(day => {
    Object.entries(day).forEach(([act, n]) => { allTimeCounts[act] = (allTimeCounts[act] || 0) + n; });
  });
  const topExercise = Object.entries(allTimeCounts).sort((a, b) => b[1] - a[1])[0];

  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    const dateStr = local.toISOString().split('T')[0];
    const dayCounts = activityCounts[dateStr] || {};
    const sessions = Object.values(dayCounts).reduce((a, b) => a + b, 0);
    return { n: i + 1, dateStr, isToday: dateStr === todayStr, sessions };
  });

  const unlocked = gamification.unlockedBadgeIds;
  const allOtherBadges = ALL_BADGES.filter(b => b.id !== 'grand_master');
  const grandMasterUnlocked = unlocked.includes('grand_master');
  const badgeProgress = (badgeId: string): { current: number; target: number } | null => {
    if (badgeId === 'streak_3')    return { current: gamification.streak, target: 3 };
    if (badgeId === 'streak_7')    return { current: gamification.streak, target: 7 };
    if (badgeId === 'streak_14')   return { current: gamification.streak, target: 14 };
    if (badgeId === 'streak_30')   return { current: gamification.streak, target: 30 };
    if (badgeId === 'xp_100')      return { current: gamification.xp, target: 100 };
    if (badgeId === 'xp_500')      return { current: gamification.xp, target: 500 };
    if (badgeId === 'xp_1000')     return { current: gamification.xp, target: 1000 };
    if (badgeId === 'sessions_10') return { current: totalUniqueSessions, target: 10 };
    if (badgeId === 'sessions_25') return { current: totalUniqueSessions, target: 25 };
    if (badgeId === 'sessions_50') return { current: totalUniqueSessions, target: 50 };
    if (badgeId === 'grand_master')return { current: unlocked.filter(id => id !== 'grand_master').length, target: allOtherBadges.length };
    return null;
  };

  const dailyMsg = DAILY_MESSAGES[getDayOfYear() % DAILY_MESSAGES.length];
  const hasActivityToday = todayActivities.length > 0;

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="rounded-3xl p-4 border"
        style={hasActivityToday
          ? { background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', borderColor: '#bbf7d0' }
          : gamification.streak > 0
          ? { background: 'linear-gradient(135deg, #fff7ed, #fffbeb)', borderColor: '#fed7aa' }
          : { background: 'linear-gradient(135deg, #F5EFFF, #fdf4ff)', borderColor: 'rgba(179,136,196,0.3)' }
        }>
        {hasActivityToday ? (
          <div className="flex items-center gap-3"><span className="text-2xl">🌟</span>
            <div><p className="text-xs font-black text-emerald-700">Missão do dia cumprida!</p>
              <p className="text-[11px] text-emerald-600 leading-snug">{dailyMsg}</p></div></div>
        ) : gamification.streak > 0 ? (
          <div className="flex items-center gap-3"><span className="text-2xl">🔥</span>
            <div><p className="text-xs font-black text-orange-700">Não quebre sua racha de {gamification.streak} dias!</p>
              <p className="text-[11px] text-orange-600 leading-snug">Faça ao menos 1 exercício hoje para manter.</p></div></div>
        ) : (
          <div className="flex items-center gap-3"><span className="text-2xl">💜</span>
            <div><p className="text-xs font-black text-[#9d6eb5]">Missão de hoje</p>
              <p className="text-[11px] text-[#b388c4] leading-snug">{dailyMsg}</p></div></div>
        )}
      </motion.div>

      <div className="rounded-3xl p-5 border border-white/40 shadow-md overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${levelInfo.bg}, white)` }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30"
          style={{ background: levelInfo.color }} />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${levelInfo.color}dd, ${levelInfo.color})` }}>
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nível Atual</p>
              <span className="text-[11px] font-black" style={{ color: levelInfo.color }}>{gamification.xp} XP</span>
            </div>
            <h3 className="font-black text-lg text-[#1e293b] leading-tight">{levelInfo.name}</h3>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                animate={{ width: `${Math.max(3, xpProgress)}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${levelInfo.color}88, ${levelInfo.color})` }} />
            </div>
            {nextLevel && <p className="text-[9px] text-gray-400 font-bold mt-1">→ {nextLevel.name} em {nextLevel.min - gamification.xp} XP</p>}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 relative z-10">
          {[
            { icon: <Flame className="w-3.5 h-3.5" />, label: 'Racha',   value: gamification.streak,  color: '#f97316', bg: '#fff7ed' },
            { icon: <Star className="w-3.5 h-3.5" />,  label: 'Dias',    value: totalDaysActive,       color: '#b388c4', bg: '#F5EFFF' },
            { icon: <Zap className="w-3.5 h-3.5" />,   label: 'Sessões', value: totalRawSessions,      color: '#3b82f6', bg: '#eff6ff' },
            { icon: <Target className="w-3.5 h-3.5" />,label: 'Badges',  value: `${unlocked.length}/${ALL_BADGES.length}`, color: '#10b981', bg: '#ecfdf5' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-2 text-center border border-white/60" style={{ background: s.bg }}>
              <div className="flex justify-center mb-0.5" style={{ color: s.color }}>{s.icon}</div>
              <p className="text-sm font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8px] text-gray-400 font-bold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex bg-gray-100/80 p-1 rounded-2xl shadow-inner">
        {([['stats', '📊 Semana'], ['badges', '🏆 Conquistas'], ['calendar', '📅 Calendário']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setView(v)}
            className="flex-1 py-2 text-[11px] font-black rounded-xl transition-all"
            style={view === v ? { background: 'white', color: '#b388c4', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 rounded-2xl p-3 text-center border border-blue-100 bg-blue-50">
                <p className="text-xl font-black text-blue-600">{weekSessions}</p>
                <p className="text-[10px] text-blue-400 font-bold">sessões esta semana</p>
              </div>
              <div className="flex-1 rounded-2xl p-3 text-center border border-purple-100 bg-[#F5EFFF]">
                <p className="text-xl font-black text-[#b388c4]">{weekDays.filter(d => d.totalSessions > 0).length}</p>
                <p className="text-[10px] text-[#b388c4] font-bold">dias ativos</p>
              </div>
              {topExercise && (
                <div className="flex-1 rounded-2xl p-3 text-center border border-emerald-100 bg-emerald-50">
                  <p className="text-lg font-black text-emerald-600">{ACT_EMOJI[topExercise[0]] || '✅'}</p>
                  <p className="text-[10px] text-emerald-500 font-bold leading-tight">favorito<br/>×{topExercise[1]}</p>
                </div>
              )}
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-black text-sm text-[#1e293b] mb-1">Sessões — Últimos 7 Dias</h3>
              <p className="text-[10px] text-gray-400 mb-4">Inclui todas as repetições do dia</p>
              <div className="flex items-end justify-between gap-1 h-32">
                {weekDays.map((day, i) => {
                  const barH = day.totalSessions > 0 ? Math.max(14, (day.totalSessions / maxSessions) * 80) : 0;
                  const moodColor = day.mood ? MOOD_COLOR[day.mood] : '#e5e7eb';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {day.mood ? <span className="text-base">{MOOD_EMOJIS[day.mood]}</span> : <span className="text-base opacity-20">·</span>}
                      <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
                        {day.totalSessions > 0 ? (
                          <motion.div className="w-full rounded-lg" initial={{ height: 0 }}
                            animate={{ height: `${barH}px` }} transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                            style={{ background: day.isToday ? 'linear-gradient(180deg, #b388c4, #9d6eb5)' : `linear-gradient(180deg, ${moodColor}88, ${moodColor}44)` }} />
                        ) : <div className="w-full h-1.5 rounded-full bg-gray-100" />}
                      </div>
                      <span className="text-[9px] font-black uppercase" style={{ color: day.isToday ? '#b388c4' : '#94a3b8' }}>{day.label}</span>
                      {day.totalSessions > 0 && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: day.isToday ? '#b388c4' : '#f1f5f9', color: day.isToday ? 'white' : '#64748b' }}>
                          ×{day.totalSessions}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
                  {todayActivities.map((act, i) => {
                    const count = todayCounts[act] || 1;
                    return (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-3 text-xs p-3 rounded-xl border"
                        style={{ background: '#F5EFFF', borderColor: 'rgba(179,136,196,0.2)' }}>
                        <span className="text-base">{ACT_EMOJI[act] || '✅'}</span>
                        <span className="font-bold text-[#1e293b] flex-1">{act}</span>
                        {count > 1 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#b388c4]/10 text-[#b388c4]">×{count}</span>
                        )}
                        <span className="text-[10px] font-black text-[#b388c4]">+{XP_TABLE[act] || 20} XP</span>
                      </motion.li>
                    );
                  })}
                  {Object.values(todayCounts).reduce((a,b)=>a+b,0) > todayActivities.length && (
                    <div className="text-center pt-1">
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {Object.values(todayCounts).reduce((a,b)=>a+b,0)} sessões totais hoje
                        <span className="text-gray-300"> · XP já premiado por exercício único</span>
                      </span>
                    </div>
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {view === 'badges' && (
          <motion.div key="badges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }} className="space-y-4">
            {grandMasterUnlocked ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="rounded-3xl p-5 text-center border-2 overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #fef9c3, #fef3c7, #fef9c3)', borderColor: '#fbbf24' }}>
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <span className="text-5xl">🌈</span>
                </motion.div>
                <h3 className="text-lg font-black text-amber-800 mt-2">Guardião Supremo</h3>
                <p className="text-xs text-amber-600 mt-1">Você desbloqueou TODAS as conquistas.<br/>Você é uma inspiração para todos!</p>
              </motion.div>
            ) : (
              <div className="rounded-2xl p-4 border border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-gray-500">Progresso total</span>
                  <span className="text-xs font-black text-[#b388c4]">{unlocked.length}/{ALL_BADGES.length}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                    animate={{ width: `${(unlocked.length / ALL_BADGES.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(90deg, #b388c4, #a78bfa)' }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Faltam {ALL_BADGES.length - unlocked.length} conquistas para o título <strong>Guardião Supremo 🌈</strong>
                </p>
              </div>
            )}
            {(Object.keys(BADGE_CATEGORIES) as (keyof typeof BADGE_CATEGORIES)[]).map(cat => {
              const catBadges = ALL_BADGES.filter(b => b.category === cat);
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-base">{BADGE_CATEGORIES[cat].emoji}</span>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{BADGE_CATEGORIES[cat].label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {catBadges.map(badge => {
                      const isUnlocked = unlocked.includes(badge.id);
                      const prog = badgeProgress(badge.id);
                      const pct = prog ? Math.min(100, (prog.current / prog.target) * 100) : 0;
                      return (
                        <motion.div key={badge.id} whileTap={isUnlocked ? { scale: 0.97 } : {}}
                          className="rounded-2xl p-3.5 border"
                          style={{ background: isUnlocked ? 'linear-gradient(135deg, #F5EFFF, white)' : '#f8fafc',
                            borderColor: isUnlocked ? 'rgba(179,136,196,0.35)' : '#e5e7eb' }}>
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-2xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.4)' }}>{badge.emoji}</span>
                            {isUnlocked
                              ? <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">✓</span>
                              : <Lock className="w-3 h-3 text-gray-300 mt-0.5" />}
                          </div>
                          <h4 className="font-black text-[11px] text-[#1e293b] leading-tight mb-0.5">{badge.name}</h4>
                          <p className="text-[9px] text-gray-400 leading-tight mb-2">{badge.description}</p>
                          {!isUnlocked && prog && (
                            <div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                                <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                                  style={{ background: '#b388c4' }} />
                              </div>
                              <p className="text-[9px] text-gray-400 font-bold">{prog.current}/{prog.target}</p>
                            </div>
                          )}
                          {badge.xpReward > 0 && isUnlocked && <span className="text-[9px] font-black text-[#b388c4]">+{badge.xpReward} XP ganho</span>}
                          {badge.xpReward > 0 && !isUnlocked && <span className="text-[9px] font-bold text-gray-300">+{badge.xpReward} XP ao desbloquear</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {view === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-sm capitalize text-[#1e293b]">
                  {today.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 text-gray-400 font-black uppercase">
                {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}
                {monthDays.map(day => {
                  const dayMood = moods[day.dateStr];
                  const intensity = Math.min(1, day.sessions / 5);
                  return (
                    <div key={day.n} className="flex flex-col items-center justify-center aspect-square relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center relative"
                        style={{
                          background: day.sessions > 0 ? `rgba(179,136,196,${0.3 + intensity * 0.7})` : '#f8fafc',
                          color: day.sessions > 0 ? (intensity > 0.5 ? 'white' : '#6b21a8') : '#64748b',
                          fontWeight: day.isToday ? 900 : 500,
                          border: day.isToday ? '2px solid #b388c4' : '2px solid transparent',
                        }}>
                        <span className="text-[11px]">{day.n}</span>
                      </div>
                      {day.sessions > 1 && (
                        <span className="absolute -bottom-0.5 text-[8px] font-black text-[#b388c4]">×{day.sessions}</span>
                      )}
                      {dayMood && (
                        <div className="absolute -top-1.5 -right-1 text-[9px] bg-white rounded-full shadow-sm border border-gray-100 p-[1px] z-10">
                          {MOOD_EMOJIS[dayMood]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(179,136,196,0.4)' }} />
                  <span className="text-[10px] text-gray-400 font-medium">Poucas sessões</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#b388c4' }} />
                  <span className="text-[10px] text-gray-400 font-medium">Muitas sessões</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-[#b388c4] bg-white" />
                  <span className="text-[10px] text-gray-400 font-medium">Hoje</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                         }import React, { useState } from 'react';
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
