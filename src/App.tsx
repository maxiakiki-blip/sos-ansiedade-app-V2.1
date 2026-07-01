import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HeartPulse, AlertCircle, ShieldCheck, TrendingUp, LogOut, Users, Key, Flame, Star } from 'lucide-react';

import { useLocalStorageState } from './hooks/useLocalStorageState';
import TabRescate from './components/TabRescate';
import TabPrevencion from './components/TabPrevencion';
import TabProgreso from './components/TabProgreso';
import TabAdmin from './components/TabAdmin';
import Login from './components/Login';
import NavButton from './components/NavButton';
import SecuritySettingsModal from './components/SecuritySettingsModal';
import ConfettiEffect from './components/ConfettiEffect';
import { Buyer, GamificationState, ALL_BADGES, getLevelInfo, getNextLevel } from './types';
import * as db from './lib/db';

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
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const [logs, setLogs] = useLocalStorageState<Record<string, string[]>>('sos_ansiedad_logs', {});
  const [moods, setMoods] = useLocalStorageState<Record<string, string>>('sos_ansiedad_moods', {});
  const [gamification, setGamification] = useLocalStorageState<GamificationState>('sos_gamification', DEFAULT_GAMIFICATION);

  const [currentUserEmail, setCurrentUserEmail] = useLocalStorageState<string | null>('sos_user_email', null);
  const [rawBuyers, setRawBuyers] = useLocalStorageState<any[]>('sos_registered_buyers', []);
  const [superadminPassword, setSuperadminPassword] = useLocalStorageState<string>('sos_superadmin_password', 'Dama8081-1');

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

  // ── Load buyers from Supabase on mount ──
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

  // ── Load user data from Supabase on login ──
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
        setGamification(prev =>
          serverGamification.xp > prev.xp ? serverGamification : prev
        );
      }
    }).catch(() => {});
  }, [currentUserEmail]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const unlockBadge = useCallback((badgeId: string) => {
    setGamification(prev => {
      if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
      setNewBadge(badgeId);
      setTimeout(() => setNewBadge(null), 3500);
      return { ...prev, unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId] };
    });
  }, []);

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
    if (updatedGamification.xp >= 100 && !updatedGamification.unlockedBadgeIds.includes('xp_100')) toUnlock.push('xp_100');
    if (updatedGamification.xp >= 500 && !updatedGamification.unlockedBadgeIds.includes('xp_500')) toUnlock.push('xp_500');
    if (updatedGamification.streak >= 3 && !updatedGamification.unlockedBadgeIds.includes('streak_3')) toUnlock.push('streak_3');
    if (updatedGamification.streak >= 7 && !updatedGamification.unlockedBadgeIds.includes('streak_7')) toUnlock.push('streak_7');

    const hasBreath = flatActivities.includes('Respiração Tática');
    const hasGround = flatActivities.includes('Conexão Sensorial 5-4-3-2-1');
    const hasButterfly = flatActivities.includes('Abraço de Borboleta');
    if (hasBreath && hasGround && hasButterfly && !updatedGamification.unlockedBadgeIds.includes('sos_protocol')) toUnlock.push('sos_protocol');

    toUnlock.forEach(id => {
      setGamification(prev => {
        if (prev.unlockedBadgeIds.includes(id)) return prev;
        setNewBadge(id);
        setTimeout(() => setNewBadge(null), 3500);
        return { ...prev, unlockedBadgeIds: [...prev.unlockedBadgeIds, id] };
      });
    });
  }, []);

  const logActivity = useCallback((activityName: string) => {
    const today = getTodayDate();
    let newLogs: Record<string, string[]> = {};

    setLogs(prev => {
      const todayLogs = prev[today] || [];
      if (todayLogs.includes(activityName)) return prev;
      newLogs = { ...prev, [today]: [...todayLogs, activityName] };
      return newLogs;
    });

    setGamification(prev => {
      const xpGain = XP_TABLE[activityName] || 20;
      const newXp = prev.xp + xpGain;

      let newStreak = prev.streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (prev.lastActivityDate === today) {
        // same day
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

      // Sync to Supabase
      if (currentUserEmail) {
        db.upsertGamification(currentUserEmail, updated).catch(() => {});
        db.insertActivityLog(currentUserEmail, activityName, today).catch(() => {});
      }

      return updated;
    });

    triggerConfetti();
  }, [checkBadges, currentUserEmail]);

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
        @keyframes xp-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .badge-notify { animation: badge-pop 3.5s ease-in-out forwards; }
        .xp-bar-fill { background: linear-gradient(90deg, #b388c4, #a78bfa, #60a5fa, #b388c4); background-size: 200%; animation: xp-shimmer 2s linear infinite; }
      `}</style>

      <ConfettiEffect active={showConfetti} />

      {notifiedBadge && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 badge-notify">
          <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 min-w-[260px]">
            <span className="text-3xl">{notifiedBadge.emoji}</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#b388c4]">Conquista Desbloqueada!</p>
              <p className="font-black text-sm">{notifiedBadge.name}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{notifiedBadge.description}</p>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md p-4 shadow-sm sticky top-0 z-40 border-b border-[#EAE0F1]/80">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-[#b388c4] to-[#9d6eb5] p-1.5 rounded-xl shadow-sm shadow-[#b388c4]/30">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-base font-black tracking-tight text-[#1e293b]">
                  S.O.S <span className="text-[#b388c4]">Ansiedade</span>
                </h1>
              </div>
              <span className="text-[10px] text-gray-400 font-bold mt-0.5 ml-1 select-none">
                Olá, <span className="text-[#b388c4]">{currentUserName}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {gamification.streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[11px] font-black text-orange-600">{gamification.streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-[#F5EFFF] border border-[#b388c4]/20 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-[#b388c4]" />
                <span className="text-[11px] font-black text-[#b388c4]">{gamification.xp} XP</span>
              </div>
              {isSuperadmin && (
                <span className="text-[9px] bg-amber-50 text-amber-700 font-extrabold border border-amber-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
                  Admin
                </span>
              )}
              <button onClick={() => setIsSecurityModalOpen(true)} title="Segurança"
                className="p-1 text-gray-400 hover:text-[#b388c4] rounded-lg transition-colors">
                <Key className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleLogout} title="Sair"
                className="p-1 text-gray-400 hover:text-rose-500 rounded-lg transition-colors">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider whitespace-nowrap"
              style={{ color: levelInfo.color }}>
              {levelInfo.name}
            </span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full xp-bar-fill transition-all duration-700"
                style={{ width: `${Math.max(2, xpProgress)}%` }} />
            </div>
            {nextLevel && (
              <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{nextLevel.name} →</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {activeTab === 'rescate' && <TabRescate logActivity={logActivity} />}
        {activeTab === 'prevencion' && (
          <TabPrevencion logActivity={logActivity} logMood={logMood} currentMood={moods[getTodayDate()]} />
        )}
        {activeTab === 'progreso' && (
          <TabProgreso logs={logs} moods={moods} gamification={gamification} />
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
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-md mx-auto flex justify-around">
          <NavButton icon={<AlertCircle className="w-5 h-5" />} label="Resgate" isActive={activeTab === 'rescate'} onClick={() => setActiveTab('rescate')} />
          <NavButton icon={<ShieldCheck className="w-5 h-5" />} label="Prevenção" isActive={activeTab === 'prevencion'} onClick={() => setActiveTab('prevencion')} />
          <NavButton icon={<TrendingUp className="w-5 h-5" />} label="Progresso" isActive={activeTab === 'progreso'} onClick={() => setActiveTab('progreso')} />
          {isSuperadmin && (
            <NavButton icon={<Users className="w-5 h-5" />} label="Admin" isActive={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
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
