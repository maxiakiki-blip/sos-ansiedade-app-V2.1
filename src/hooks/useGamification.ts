import { useState, useCallback, useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { GamificationState, ALL_BADGES } from '../types';
import * as db from '../lib/db';
import { checkAndShowDailyReminder } from '../lib/notifications';

// XP por actividad — fuente única para toda la app
export const XP_TABLE: Record<string, number> = {
  'Respiração Tática': 30,
  'Conexão Sensorial 5-4-3-2-1': 40,
  'Abraço de Borboleta': 35,
  'Acupressão (7 Pontos)': 35,
  'Caixa de Preocupações': 25,
  'Sons Relaxantes': 20,
  'Leitura Motivacional': 15,
};

const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  unlockedBadgeIds: [],
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * Toda la lógica de progreso vive acá: XP, rachas, badges,
 * conteo de sesiones y sincronización con Supabase.
 * App.tsx solo consume; las secciones solo llaman logActivity/logMood.
 */
export function useGamification(currentUserEmail: string | null) {
  const [logs, setLogs] = useLocalStorageState<Record<string, string[]>>('sos_ansiedad_logs', {});
  const [moods, setMoods] = useLocalStorageState<Record<string, string>>('sos_ansiedad_moods', {});
  const [gamification, setGamification] = useLocalStorageState<GamificationState>('sos_gamification', DEFAULT_GAMIFICATION);
  const [activityCounts, setActivityCounts] = useLocalStorageState<Record<string, Record<string, number>>>('sos_activity_counts', {});

  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  // ── Cargar datos del usuario desde Supabase al iniciar sesión ──
  useEffect(() => {
    if (!currentUserEmail) return;
    Promise.all([
      db.fetchUserLogs(currentUserEmail),
      db.fetchUserMoods(currentUserEmail),
      db.fetchGamification(currentUserEmail),
    ]).then(([serverLogs, serverMoods, serverGamification]) => {
      if (Object.keys(serverLogs).length > 0) {
        setLogs(prev => {
          const merged = { ...prev };
          for (const [date, activities] of Object.entries(serverLogs)) {
            merged[date] = [...new Set([...(merged[date] || []), ...activities])];
          }
          return merged;
        });
      }
      if (Object.keys(serverMoods).length > 0) {
        setMoods(prev => ({ ...serverMoods, ...prev }));
      }
      if (serverGamification && serverGamification.xp > 0) {
        setGamification(prev => serverGamification.xp > prev.xp ? serverGamification : prev);
      }
    }).catch(() => {});
  }, [currentUserEmail]);

  // ── Recordatorio diario ──
  useEffect(() => {
    if (!currentUserEmail) return;
    const timer = setTimeout(() => { checkAndShowDailyReminder(logs); }, 3000);
    return () => clearTimeout(timer);
  }, [currentUserEmail, logs]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const checkBadges = useCallback((activityName: string, updated: GamificationState, allLogs: Record<string, string[]>) => {
    const toUnlock: string[] = [];
    const flat = Object.values(allLogs).flat();
    const has = (id: string) => updated.unlockedBadgeIds.includes(id);

    if (activityName === 'Respiração Tática' && !has('first_breath')) toUnlock.push('first_breath');
    if (activityName === 'Conexão Sensorial 5-4-3-2-1' && !has('first_grounding')) toUnlock.push('first_grounding');
    if (activityName === 'Abraço de Borboleta' && !has('first_butterfly')) toUnlock.push('first_butterfly');
    if (activityName === 'Acupressão (7 Pontos)' && !has('first_tapping')) toUnlock.push('first_tapping');
    if (activityName === 'Caixa de Preocupações' && !has('worry_released')) toUnlock.push('worry_released');
    if (activityName === 'Sons Relaxantes' && !has('sound_healer')) toUnlock.push('sound_healer');
    if (activityName === 'Leitura Motivacional' && !has('motivation_read')) toUnlock.push('motivation_read');
    if (updated.xp >= 100  && !has('xp_100'))  toUnlock.push('xp_100');
    if (updated.xp >= 500  && !has('xp_500'))  toUnlock.push('xp_500');
    if (updated.xp >= 1000 && !has('xp_1000')) toUnlock.push('xp_1000');
    if (updated.streak >= 3  && !has('streak_3'))  toUnlock.push('streak_3');
    if (updated.streak >= 7  && !has('streak_7'))  toUnlock.push('streak_7');
    if (updated.streak >= 14 && !has('streak_14')) toUnlock.push('streak_14');
    if (updated.streak >= 30 && !has('streak_30')) toUnlock.push('streak_30');
    const totalSessions = flat.length;
    if (totalSessions >= 10 && !has('sessions_10')) toUnlock.push('sessions_10');
    if (totalSessions >= 25 && !has('sessions_25')) toUnlock.push('sessions_25');
    if (totalSessions >= 50 && !has('sessions_50')) toUnlock.push('sessions_50');
    if (flat.includes('Respiração Tática') && flat.includes('Conexão Sensorial 5-4-3-2-1') && flat.includes('Abraço de Borboleta') && !has('sos_protocol')) toUnlock.push('sos_protocol');

    toUnlock.forEach(id => {
      setGamification(prev => {
        if (prev.unlockedBadgeIds.includes(id)) return prev;
        const newIds = [...prev.unlockedBadgeIds, id];
        setNewBadge(id);
        setTimeout(() => setNewBadge(null), 3500);
        // Gran maestro: todas las demás desbloqueadas
        const allOtherIds = ALL_BADGES.filter(b => b.id !== 'grand_master').map(b => b.id);
        if (allOtherIds.every(bid => newIds.includes(bid)) && !newIds.includes('grand_master')) {
          setTimeout(() => {
            setGamification(g => ({ ...g, unlockedBadgeIds: [...g.unlockedBadgeIds, 'grand_master'] }));
            setNewBadge('grand_master');
            setTimeout(() => setNewBadge(null), 5000);
          }, 2000);
        }
        return { ...prev, unlockedBadgeIds: newIds };
      });
    });
  }, []);

  const logActivity = useCallback((activityName: string) => {
    const today = getTodayDate();
    let newLogs: Record<string, string[]> = {};

    // Siempre cuenta la repetición (independiente del XP)
    setActivityCounts(prev => {
      const day = prev[today] || {};
      return { ...prev, [today]: { ...day, [activityName]: (day[activityName] || 0) + 1 } };
    });

    setLogs(prev => {
      const todayLogs = prev[today] || [];
      if (todayLogs.includes(activityName)) return prev;
      newLogs = { ...prev, [today]: [...todayLogs, activityName] };
      return newLogs;
    });

    setGamification(prev => {
      const todayLogs = logs[today] || [];
      if (todayLogs.includes(activityName)) return prev; // XP una vez por día

      const newXp = prev.xp + (XP_TABLE[activityName] || 20);

      let newStreak = prev.streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (prev.lastActivityDate === today) { /* misma jornada */ }
      else if (prev.lastActivityDate === yesterdayStr) newStreak = prev.streak + 1;
      else newStreak = 1;

      const updated: GamificationState = { ...prev, xp: newXp, streak: newStreak, lastActivityDate: today };

      setTimeout(() => checkBadges(activityName, updated, newLogs), 100);

      if (currentUserEmail) {
        db.upsertGamification(currentUserEmail, updated).catch(() => {});
        db.insertActivityLog(currentUserEmail, activityName, today).catch(() => {});
      }
      return updated;
    });

    triggerConfetti();
  }, [checkBadges, currentUserEmail, logs]);

  const logMood = useCallback((moodId: string) => {
    const today = getTodayDate();
    setMoods(prev => ({ ...prev, [today]: moodId }));
    if (currentUserEmail) {
      db.upsertMood(currentUserEmail, moodId, today).catch(() => {});
    }
  }, [currentUserEmail]);

  return { logs, moods, gamification, activityCounts, showConfetti, newBadge, logActivity, logMood };
}

