import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, AlertCircle, ShieldCheck, TrendingUp, LogOut, Users, Key, Flame } from 'lucide-react';

import { useLocalStorageState } from './hooks/useLocalStorageState';
import TabRescate from './components/TabRescate';
import TabPrevencion from './components/TabPrevencion';
import TabProgreso from './components/TabProgreso';
import TabAdmin from './components/TabAdmin';
import Login from './components/Login';
import NavButton from './components/NavButton';
import SecuritySettingsModal from './components/SecuritySettingsModal';
import ConfettiEffect from './components/ConfettiEffect';
import Onboarding from './components/Onboarding';
import { Buyer, GamificationState, ALL_BADGES, getLevelInfo, getNextLevel } from './types';
import * as db from './lib/db';
import { requestNotificationPermission, showNotification, checkAndShowDailyReminder } from './lib/notifications';

const XP_TABLE: Record<string, number> = {
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

export default function App() {
  const [activeTab, setActiveTab] = useState('rescate');
  const [prevTab, setPrevTab] = useState('rescate');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const [logs, setLogs] = useLocalStorageState<Record<string, string[]>>('sos_ansiedad_logs', {});
  const [moods, setMoods] = useLocalStorageState<Record<string, string>>('sos_ansiedad_moods', {});
  const [gamification, setGamification] = useLocalStorageState<GamificationState>('sos_gamification', DEFAULT_GAMIFICATION);
  const [activityCounts, setActivityCounts] = useLocalStorageState<Record<string, Record<string, number>>>('sos_activity_counts', {});

  const [currentUserEmail, setCurrentUserEmail] = useLocalStorageState<string | null>('sos_user_email', null);
  const [rawBuyers, setRawBuyers] = useLocalStorageState<any[]>('sos_registered_buyers', []);
  const [superadminPassword, setSuperadminPassword] = useLocalStorageState<string>('sos_superadmin_password', 'Dama8081-1');
  const [onboardingDone, setOnboardingDone] = useLocalStorageState<Record<string, boolean>>('sos_onboarding_done', {});
  const [showOnboarding, setShowOnboarding] = useState(false);

  const registeredBuyers: Buyer[] = React.useMemo(() => {
    return rawBuyers.map(b => {
      if (typeof b === 'string') {
        return { email: b.trim().toLowerCase(), password: 'sos123_mudar', name: 'Comprador', registrationDate: new Date().toLocaleDateString('pt-BR') };
      }
      return {
        email: (b.email || '').trim().toLowerCase(),
        password: b.password || 'sos123_mudar',
        name: b.name || 'Comprador',
        registrationDate: b.registrationDate || new Date().toLocaleDateString('pt-BR'),
      };
    });
  }, [rawBuyers]);

  useEffect(() => {
    db.fetchBuyers().then(serverBuyers => {
      if (serverBuyers.length === 0) return;
      setRawBuyers(prev => {
        const localOnly = prev.filter(local => {
          const localEmail = typeof local === 'string' ? local : local.email;
          return !serverBuyers.some(s => s.email === localEmail?.toLowerCase());
        });
        return [...serverBuyers, ...localOnly];
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;
    if (!onboardingDone[currentUserEmail]) {
      setShowOnboarding(true);
    }
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
        setGamification(prev =>
          serverGamification.xp > prev.xp ? serverGamification : prev
        );
      }
    }).catch(() => {});
  }, [currentUserEmail]);

  useEffect(() => {
    if (!currentUserEmail) return;
    const timer = setTimeout(() => {
      checkAndShowDailyReminder(logs);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentUserEmail, logs]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const handleOnboardingComplete = async () => {
    if (currentUserEmail) {
      setOnboardingDone(prev => ({ ...prev, [currentUserEmail]: true }));
    }
    setShowOnboarding(false);
    const granted = await requestNotificationPermission();
    if (granted) {
      setTimeout(() => {
        showNotification('S.O.S Ansiedade 💜', 'Notificações ativadas! Te avisaremos para praticar diariamente.');
      }, 1000);
    }
  };

  const checkBadges = useCallback((activityName: string, updatedGamification: GamificationState, allLogs: Record<string, string[]>) => {
    const toUnlock: string[] = [];
    const flatActivities = Object.values(allLogs).flat();

    if (activityName === 'Respiração Tática' && !updatedGamification.unlockedBadgeIds.includes('first_breath')) toUnlock.push('first_breath');
    if (activityName === 'Conexão Sensorial 5-4-3-2-1' && !updatedGamification.unlockedBadgeIds.includes('first_grounding')) toUnlock.push('first_grounding');
    if (activityName === 'Abraço de Borboleta' && !updatedGamification.unlockedBadgeIds.includes('first_butterfly')) toUnlock.push('first_butterfly');
    if (activityName === 'Acupressão (7 Pontos)' && !updatedGamification.unlockedBadgeIds.includes('first_tapping')) toUnlock.push('first_tapping');
    if (activityName === 'Caixa de Preocupações' && !updatedGamification.unlockedBadgeIds.includes('worry_released')) toUnlock.push('worry_released');
    if (activityName === 'Sons Relaxantes' && !updatedGamification.unlockedBadgeIds.includes('sound_healer')) toUnlock.push('sound_healer');
    if (activityName === 'Leitura Motivacional' && !updatedGamification.unlockedBadgeIds.includes('motivation_read')) toUnlock.push('motivation_read');
    if (updatedGamification.xp >= 100  && !updatedGamification.unlockedBadgeIds.includes('xp_100'))   toUnlock.push('xp_100');
    if (updatedGamification.xp >= 500  && !updatedGamification.unlockedBadgeIds.includes('xp_500'))   toUnlock.push('xp_500');
    if (updatedGamification.xp >= 1000 && !updatedGamification.unlockedBadgeIds.includes('xp_1000'))  toUnlock.push('xp_1000');
    if (updatedGamification.streak >= 3  && !updatedGamification.unlockedBadgeIds.includes('streak_3'))  toUnlock.push('streak_3');
    if (updatedGamification.streak >= 7  && !updatedGamification.unlockedBadgeIds.includes('streak_7'))  toUnlock.push('streak_7');
    if (updatedGamification.streak >= 14 && !updatedGamification.unlockedBadgeIds.includes('streak_14')) toUnlock.push('streak_14');
    if (updatedGamification.streak >= 30 && !updatedGamification.unlockedBadgeIds.includes('streak_30')) toUnlock.push('streak_30');
    const totalSessions = Object.values(allLogs).flat().length;
    if (totalSessions >= 10 && !updatedGamification.unlockedBadgeIds.includes('sessions_10')) toUnlock.push('sessions_10');
    if (totalSessions >= 25 && !updatedGamification.unlockedBadgeIds.includes('sessions_25')) toUnlock.push('sessions_25');
    if (totalSessions >= 50 && !updatedGamification.unlockedBadgeIds.includes('sessions_50')) toUnlock.push('sessions_50');

    const hasBreath = flatActivities.includes('Respiração Tática');
    const hasGround = flatActivities.includes('Conexão Sensorial 5-4-3-2-1');
    const hasButterfly = flatActivities.includes('Abraço de Borboleta');
    if (hasBreath && hasGround && hasButterfly && !updatedGamification.unlockedBadgeIds.includes('sos_protocol')) toUnlock.push('sos_protocol');

    toUnlock.forEach(id => {
      setGamification(prev => {
        if (prev.unlockedBadgeIds.includes(id)) return prev;
        const newIds = [...prev.unlockedBadgeIds, id];
        setNewBadge(id);
        setTimeout(() => setNewBadge(null), 3500);
        const allOtherIds = ALL_BADGES.filter(b => b.id !== 'grand_master').map(b => b.id);
        const allUnlocked = allOtherIds.every(bid => newIds.includes(bid));
        if (allUnlocked && !newIds.includes('grand_master')) {
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

    // Always increment raw session count before XP dedup check
    setActivityCounts(prev => {
      const dayCounts = prev[today] || {};
      return { ...prev, [today]: { ...dayCounts, [activityName]: (dayCounts[activityName] || 0) + 1 } };
    });

    setLogs(prev => {
      const todayLogs = prev[today] || [];
      if (todayLogs.includes(activityName)) return prev;
      newLogs = { ...prev, [today]: [...todayLogs, activityName] };
      return newLogs;
    });

    setGamification(prev => {
      const todayLogs = logs[today] || [];
      if (todayLogs.includes(activityName)) return prev;

      const xpGain = XP_TABLE[activityName] || 20;
      const newXp = prev.xp + xpGain;

      let newStreak = prev.streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (prev.lastActivityDate === today) {
        // same day — streak unchanged
      } else if (prev.lastActivityDate === yesterdayStr) {
        newStreak = prev.streak + 1;
      } else {
        newStreak = 1;
      }

      const updated: GamificationState = {
        ...prev,
        xp: newXp,
        streak: newStreak,
        lastActivityDate: today,
        unlockedBadgeIds: prev.unlockedBadgeIds,
      };

      setTimeout(() => checkBadges(activityName, updated, newLogs), 100);

      if (currentUserEmail) {
        db.upsertGamification(currentUserEmail, updated).catch(() => {});
        db.insertActivityLog(currentUserEmail, activityName, today).catch(() => {});
      }

      return updated;
    });

    triggerConfetti();
  }, [checkBadges, currentUserEmail, logs]);

  const logMood = (moodId: string) => {
    const today = getTodayDate();
    setMoods(prev => ({ ...prev, [today]: moodId }));
    if (currentUserEmail) {
      db.upsertMood(currentUserEmail, moodId, today).catch(() => {});
    }
  };

  const handleAddBuyer = (buyer: Buyer) => {
    setRawBuyers(prev => {
      const filtered = prev.filter(b => {
        const email = typeof b === 'string' ? b : b.email;
        return email?.trim().toLowerCase() !== buyer.email.toLowerCase();
      });
      return [...filtered, buyer];
    });
    db.upsertBuyer(buyer).catch(() => {});
  };

  const handleRemoveBuyer = (email: string) => {
    setRawBuyers(prev => prev.filter(b => {
      const bEmail = typeof b === 'string' ? b : b.email;
      return bEmail?.trim().toLowerCase() !== email.trim().toLowerCase();
    }));
    db.deleteBuyer(email).catch(() => {});
  };

  const handleUpdateBuyerPassword = (email: string, newPass: string) => {
    setRawBuyers(prev => prev.map(b => {
      const bEmail = typeof b === 'string' ? b : b.email;
      if (bEmail?.trim().toLowerCase() === email.trim().toLowerCase()) {
        const name = typeof b === 'string' ? 'Comprador' : b.name;
        const regDate = typeof b === 'string' ? new Date().toLocaleDateString('pt-BR') : b.registrationDate;
        return { email: email.trim().toLowerCase(), password: newPass, name: name || 'Comprador', registrationDate: regDate };
      }
      return b;
    }));
    const buyer = registeredBuyers.find(b => b.email === email.trim().toLowerCase());
    if (buyer) db.upsertBuyer({ ...buyer, password: newPass }).catch(() => {});
  };

  const handleImportBuyers = (buyers: Buyer[]) => {
    setRawBuyers(buyers);
    buyers.forEach(b => db.upsertBuyer(b).catch(() => {}));
  };

  const handleLogout = () => { setCurrentUserEmail(null); setActiveTab('rescate'); };

  const handleTabChange = (tab: string) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  if (!currentUserEmail) {
    return (
      <Login
        onLogin={async (email) => {
          const cleanEmail = email.trim().toLowerCase();
          const exists = registeredBuyers.some(b => b.email.trim().toLowerCase() === cleanEmail);
          if (!exists && cleanEmail !== 'maxiakiki@hotmail.com') {
            handleAddBuyer({ email: cleanEmail, name: 'Comprador SOS', password: 'CodE:1243', registrationDate: new Date().toLocaleDateString('pt-BR') });
          }
          setCurrentUserEmail(cleanEmail);
        }}
        registeredBuyers={registeredBuyers}
        superadminPassword={superadminPassword}
      />
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const isSuperadmin = currentUserEmail.trim().toLowerCase() === 'maxiakiki@hotmail.com';
  const currentUserName = isSuperadmin
    ? 'Superadmin'
    : (registeredBuyers.find(b => b.email.toLowerCase() === currentUserEmail.trim().toLowerCase())?.name || 'Comprador');

  const levelInfo = getLevelInfo(gamification.xp);
  const nextLevel = getNextLevel(gamification.xp);
  const xpForCurrentLevel = levelInfo.min;
  const xpForNextLevel = nextLevel ? nextLevel.min : gamification.xp;
  const xpProgress = nextLevel ? ((gamification.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 100;

  const notifiedBadge = newBadge ? ALL_BADGES.find(b => b.id === newBadge) : null;

  const tabOrder = ['rescate', 'prevencion', 'progreso', 'admin'];
  const tabDirection = tabOrder.indexOf(activeTab) > tabOrder.indexOf(prevTab) ? 1 : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F9F4FE] to-[#F0EEF8] text-[#1e293b] font-sans pb-24 selection:bg-[#b388c4] selection:text-white">
      <style>{`
        @keyframes anim-circular { 0% { transform: translate(0,-3px); } 25% { transform: translate(3px,0); } 50% { transform: translate(0,3px); } 75% { transform: translate(-3px,0); } 100% { transform: translate(0,-3px); } }
        @keyframes anim-vertical { 0%,100% { transform: translateY(-4px); } 50% { transform: translateY(4px); } }
        @keyframes anim-horizontal { 0%,100% { transform: translateX(-6px); } 50% { transform: translateX(6px); } }
        @keyframes anim-pulsating { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.8); opacity: 0.3; } }
        @keyframes anim-tapping { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes anim-friction { 0%,100% { transform: translateX(-4px) translateY(-2px); } 25% { transform: translateX(4px) translateY(2px); } 50% { transform: translateX(-4px) translateY(2px); } 75% { transform: translateX(4px) translateY(-2px); } }
        @keyframes badge-pop { 0% { transform: translateY(100px) scale(0.5); opacity: 0; } 15% { transform: translateY(0) scale(1.1); opacity: 1; } 85% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-20px) scale(0.9); opacity: 0; } }
        .badge-notify { animation: badge-pop 3.5s ease-in-out forwards; }
      `}</style>

      <ConfettiEffect active={showConfetti} />

      <AnimatePresence>
        {notifiedBadge && (
          <motion.div key={notifiedBadge.id}
            initial={{ y: 80, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 min-w-[260px]">
              <span className="text-3xl">{notifiedBadge.emoji}</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#b388c4]">Conquista Desbloqueada!</p>
                <p className="font-black text-sm">{notifiedBadge.name}</p>
                <p className="text-[10px] text-gray-400 leading-tight">{notifiedBadge.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white/85 backdrop-blur-md px-4 pt-4 pb-3 shadow-sm sticky top-0 z-40 border-b border-[#EAE0F1]/60">
        <div className="max-w-md mx-auto">
          {/* Row 1 — identity + actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="bg-gradient-to-br from-[#b388c4] to-[#9d6eb5] w-[34px] h-[34px] rounded-[11px] flex items-center justify-center shadow-sm shadow-[#b388c4]/30 flex-shrink-0">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <h1 className="text-[15px] font-bold tracking-tight text-[#1c1c2e] truncate">
                  S.O.S <span className="text-[#b388c4]">Ansiedade</span>
                </h1>
                <span className="text-[11px] text-gray-400 font-normal select-none truncate">
                  Olá, {currentUserName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => setIsSecurityModalOpen(true)} title="Segurança"
                className="w-[30px] h-[30px] rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#b388c4] transition-colors">
                <Key className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleLogout} title="Sair"
                className="w-[30px] h-[30px] rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2 — unified progress card */}
          <div className="bg-[#f9f7fc] rounded-2xl px-3.5 py-2.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: levelInfo.color }}>
                  {levelInfo.name}
                </span>
                <span className="text-[11px] text-gray-400 font-normal tabular-nums whitespace-nowrap">
                  {gamification.xp.toLocaleString('pt-BR')} <span className="text-[9px]">XP</span>
                </span>
              </div>
              <div className="h-1 bg-[#ece7f3] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(4, xpProgress)}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ background: levelInfo.color }} />
              </div>
              {nextLevel && (
                <p className="text-[9px] text-gray-300 font-medium mt-1 whitespace-nowrap">
                  {nextLevel.min - gamification.xp} XP para {nextLevel.name}
                </p>
              )}
            </div>

            {gamification.streak > 0 && (
              <>
                <div className="w-px h-8 bg-[#e6e0ee] flex-shrink-0" />
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center flex-shrink-0 min-w-[36px]">
                  <Flame className="w-[18px] h-[18px] text-orange-500" />
                  <span className="text-[11px] font-semibold text-orange-500 mt-0.5 leading-none">
                    {gamification.streak}
                    <span className="text-[9px] text-gray-400 font-normal"> dias</span>
                  </span>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={tabDirection}>
          <motion.div key={activeTab} custom={tabDirection}
            initial={{ opacity: 0, x: tabDirection * 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tabDirection * -30 }} transition={{ duration: 0.22, ease: 'easeInOut' }}>
            {activeTab === 'rescate' && <TabRescate logActivity={logActivity} />}
            {activeTab === 'prevencion' && (
              <TabPrevencion logActivity={logActivity} logMood={logMood} currentMood={moods[getTodayDate()]} />
            )}
            {activeTab === 'progreso' && (
              <TabProgreso logs={logs} moods={moods} gamification={gamification} activityCounts={activityCounts} />
            )}
            {activeTab === 'admin' && isSuperadmin && (
              <TabAdmin
                registeredBuyers={registeredBuyers}
                onAddBuyer={handleAddBuyer}
                onRemoveBuyer={handleRemoveBuyer}
                superadminEmail="maxiakiki@hotmail.com"
                superadminPassword={superadminPassword}
                onChangeSuperadminPassword={setSuperadminPassword}
                onImportBuyers={handleImportBuyers}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto flex justify-around">
          <NavButton icon={<AlertCircle className="w-5 h-5" />} label="Resgate" isActive={activeTab === 'rescate'} onClick={() => handleTabChange('rescate')} />
          <NavButton icon={<ShieldCheck className="w-5 h-5" />} label="Prevenção" isActive={activeTab === 'prevencion'} onClick={() => handleTabChange('prevencion')} />
          <NavButton icon={<TrendingUp className="w-5 h-5" />} label="Progresso" isActive={activeTab === 'progreso'} onClick={() => handleTabChange('progreso')} />
          {isSuperadmin && (
            <NavButton icon={<Users className="w-5 h-5" />} label="Admin" isActive={activeTab === 'admin'} onClick={() => handleTabChange('admin')} />
          )}
        </div>
      </nav>

      <SecuritySettingsModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUserEmail={currentUserEmail}
        isSuperadmin={isSuperadmin}
        registeredBuyers={registeredBuyers}
        superadminPassword={superadminPassword}
        onChangeSuperadminPassword={setSuperadminPassword}
        onUpdateBuyerPassword={handleUpdateBuyerPassword}
      />
    </div>
  );
}
