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
  unlockedAt?: string;
}

export interface GamificationState {
  xp: number;
  streak: number;
  lastActivityDate: string | null;
  unlockedBadgeIds: string[];
}

export const LEVELS = [
  { min: 0,   max: 99,  name: 'Iniciante',       color: '#94a3b8', bg: '#f1f5f9' },
  { min: 100, max: 299, name: 'Aprendiz Zen',     color: '#60a5fa', bg: '#eff6ff' },
  { min: 300, max: 699, name: 'Guerreiro da Paz', color: '#34d399', bg: '#ecfdf5' },
  { min: 700, max: 1499,name: 'Mestre Zen',        color: '#a78bfa', bg: '#f5f3ff' },
  { min: 1500,max: Infinity, name: 'Guardião Sereno', color: '#fbbf24', bg: '#fffbeb' },
];

export function getLevelInfo(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

export function getNextLevel(xp: number) {
  const idx = LEVELS.findIndex(l => xp >= l.min && xp <= l.max);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export const ALL_BADGES: Badge[] = [
  { id: 'first_breath',     emoji: '🌬️', name: 'Primeira Respiração',    description: 'Completou seu primeiro exercício de respiração tática' },
  { id: 'first_grounding',  emoji: '🌱', name: 'Pés no Chão',             description: 'Completou a técnica de conexão sensorial 5-4-3-2-1' },
  { id: 'first_butterfly',  emoji: '🦋', name: 'Abraço de Borboleta',     description: 'Realizou o abraço de borboleta (estimulação EMDR)' },
  { id: 'first_tapping',    emoji: '✋', name: 'Acupressão Iniciada',     description: 'Praticou os 7 pontos de acupressão pela primeira vez' },
  { id: 'worry_released',   emoji: '🗑️', name: 'Liberação Mental',        description: 'Destruiu uma preocupação na Caixa de Preocupações' },
  { id: 'sound_healer',     emoji: '🎵', name: 'Curador do Som',          description: 'Escutou sons terapêuticos para relaxamento' },
  { id: 'motivation_read',  emoji: '✨', name: 'Mente Positiva',          description: 'Leu frases motivacionais para reforço cognitivo' },
  { id: 'streak_3',         emoji: '🔥', name: 'Chama de 3 Dias',         description: 'Manteve uma racha de 3 dias consecutivos' },
  { id: 'streak_7',         emoji: '💎', name: 'Semana Perfeita',         description: '7 dias seguidos de prática — você é incrível!' },
  { id: 'xp_100',           emoji: '⭐', name: 'Primeira Centena',        description: 'Acumulou 100 XP de experiência no app' },
  { id: 'xp_500',           emoji: '🌟', name: 'Meio Milhar',             description: 'Acumulou 500 XP — dedicação extraordinária!' },
  { id: 'sos_protocol',     emoji: '🛡️', name: 'Protocolo Completo',      description: 'Completou o protocolo SOS completo (Respiração → Grounding → Borboleta)' },
];
