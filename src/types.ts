export interface Buyer {
  email: string;
  password: string;
  name: string;
  registrationDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'start' | 'consistency' | 'xp' | 'sessions' | 'special';
  xpReward: number;
  unlockedAt?: string;
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastActivityDate: string | null;
  unlockedBadgeIds: string[];
}

export const LEVELS = [
  { min: 0,    max: 99,       name: 'Iniciante',         color: '#94a3b8', bg: '#f1f5f9' },
  { min: 100,  max: 299,      name: 'Aprendiz Zen',      color: '#60a5fa', bg: '#eff6ff' },
  { min: 300,  max: 699,      name: 'Guerreiro da Paz',  color: '#34d399', bg: '#ecfdf5' },
  { min: 700,  max: 1499,     name: 'Mestre Zen',        color: '#a78bfa', bg: '#f5f3ff' },
  { min: 1500, max: Infinity, name: 'Guardião Sereno',   color: '#fbbf24', bg: '#fffbeb' },
];

export function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

export function getNextLevel(xp: number) {
  const idx = LEVELS.findIndex(l => xp >= l.min && xp <= l.max);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export const BADGE_CATEGORIES = {
  start:       { label: 'Primeiros Passos', emoji: '🌱' },
  consistency: { label: 'Consistência',     emoji: '🔥' },
  xp:          { label: 'Marcos de XP',     emoji: '⭐' },
  sessions:    { label: 'Sessões',          emoji: '📊' },
  special:     { label: 'Especiais',        emoji: '🏆' },
};

export const ALL_BADGES: Badge[] = [
  // Primeiros Passos
  { id: 'first_breath',    emoji: '🌬️', name: 'Primeira Respiração',   description: 'Completou seu primeiro exercício de respiração tática',         category: 'start',       xpReward: 50  },
  { id: 'first_grounding', emoji: '🌱', name: 'Pés no Chão',            description: 'Completou a técnica de conexão sensorial 5-4-3-2-1',            category: 'start',       xpReward: 50  },
  { id: 'first_butterfly', emoji: '🦋', name: 'Abraço de Borboleta',    description: 'Realizou o abraço de borboleta (estimulação EMDR)',             category: 'start',       xpReward: 50  },
  { id: 'first_tapping',   emoji: '✋', name: 'Acupressão Iniciada',    description: 'Praticou os 7 pontos de acupressão pela primeira vez',          category: 'start',       xpReward: 50  },
  { id: 'worry_released',  emoji: '🗑️', name: 'Liberação Mental',       description: 'Destruiu uma preocupação na Caixa de Preocupações',            category: 'start',       xpReward: 40  },
  { id: 'sound_healer',    emoji: '🎵', name: 'Curador do Som',         description: 'Escutou sons terapêuticos para relaxamento',                   category: 'start',       xpReward: 30  },
  { id: 'motivation_read', emoji: '✨', name: 'Mente Positiva',         description: 'Leu frases motivacionais para reforço cognitivo',              category: 'start',       xpReward: 30  },
  // Consistência
  { id: 'streak_3',        emoji: '🔥', name: 'Chama de 3 Dias',        description: '3 dias seguidos de prática',                                   category: 'consistency', xpReward: 75  },
  { id: 'streak_7',        emoji: '💎', name: 'Semana Perfeita',        description: '7 dias seguidos — você é incrível!',                          category: 'consistency', xpReward: 150 },
  { id: 'streak_14',       emoji: '🌙', name: 'Duas Semanas Zen',       description: '14 dias consecutivos de prática diária',                      category: 'consistency', xpReward: 300 },
  { id: 'streak_30',       emoji: '👑', name: 'Mês de Ouro',            description: '30 dias seguidos — conquista rarissíma!',                     category: 'consistency', xpReward: 750 },
  // Marcos XP
  { id: 'xp_100',          emoji: '⭐', name: 'Primeira Centena',       description: 'Acumulou 100 XP',                                             category: 'xp',          xpReward: 0   },
  { id: 'xp_500',          emoji: '🌟', name: 'Meio Milhar',            description: 'Acumulou 500 XP — dedicação extraordinária!',                 category: 'xp',          xpReward: 0   },
  { id: 'xp_1000',         emoji: '💫', name: 'Milhar Zen',             description: 'Acumulou 1000 XP — você chegou longe!',                       category: 'xp',          xpReward: 0   },
  // Sessões
  { id: 'sessions_10',     emoji: '📈', name: '10 Sessões',             description: '10 sessões de exercícios realizadas no total',                 category: 'sessions',    xpReward: 100 },
  { id: 'sessions_25',     emoji: '📊', name: '25 Sessões',             description: '25 sessões — você já tem um hábito formado!',                  category: 'sessions',    xpReward: 200 },
  { id: 'sessions_50',     emoji: '🚀', name: '50 Sessões',             description: '50 sessões — prática que transforma!',                         category: 'sessions',    xpReward: 400 },
  // Especiais
  { id: 'sos_protocol',    emoji: '🛡️', name: 'Protocolo Completo',     description: 'Completou o protocolo SOS completo (Respiração → Grounding → Borboleta)', category: 'special', xpReward: 200 },
  { id: 'grand_master',    emoji: '🌈', name: 'Guardião Supremo',       description: 'Desbloqueou TODAS as conquistas. Você é uma inspiração!',     category: 'special',     xpReward: 1000 },
];
