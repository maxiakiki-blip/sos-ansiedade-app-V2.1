// ─────────────────────────────────────────────────────────────
// S.O.S Ansiedade — Design System central
// Toda sección lee de aquí: colores, tipografía, radios, sombras.
// Cambiar un valor acá actualiza la app entera.
// ────────────────────────────────────────────────────────

export const COLORS = {
  // Marca
  primary: '#b388c4',
  primaryDark: '#9d6eb5',
  primaryLight: '#c9a6e8',
  primarySoft: '#f9f7fc',
  primaryTint: '#F5EFFF',

  // Texto
  ink: '#1c1c2e',
  inkSoft: '#64748b',
  inkMuted: '#94a3b8',
  inkFaint: '#cbd5e1',

  // Superficies
  surface: '#ffffff',
  surfaceSoft: '#f8fafc',

  // Estados
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  streak: '#f97316',
} as const;

// Acento fijo por sección/ejercicio — nunca inventar colores nuevos
export const SECTION = {
  breathing:  { accent: '#60a5fa', soft: '#eff6ff', grad: 'linear-gradient(145deg, #7db4f5, #4a90e2)' },
  grounding:  { accent: '#34d399', soft: '#ecfdf5', grad: 'linear-gradient(145deg, #5fc79b, #2f9d6f)' },
  butterfly:  { accent: '#b388c4', soft: '#F5EFFF', grad: 'linear-gradient(145deg, #c49fd4, #9d6eb5)' },
  tapping:    { accent: '#10b981', soft: '#ecfdf5', grad: 'linear-gradient(145deg, #34d399, #10b981)' },
  worry:      { accent: '#f87171', soft: '#fff1f2', grad: 'linear-gradient(145deg, #f89b8b, #e35f4e)' },
  sounds:     { accent: '#818cf8', soft: '#eef2ff', grad: 'linear-gradient(145deg, #93a0f8, #6366f1)' },
  quotes:     { accent: '#f0a84e', soft: '#fffbeb', grad: 'linear-gradient(145deg, #f5bc6d, #e08a4e)' },
} as const;

// Tipografía — 4 tamaños, 3 pesos. Nada fuera de esta escala.
export const TYPE = {
  h1: 'text-xl font-bold tracking-tight',        // títulos de pantalla
  h2: 'text-sm font-bold',                        // títulos de tarjeta
  body: 'text-xs font-normal',                    // texto corriente
  caption: 'text-[10px] font-semibold',           // etiquetas y pills
} as const;

// Radios y sombras en capas (profundidad sin dureza)
export const RADIUS = { card: '16px', pill: '999px', icon: '13px' } as const;
export const SHADOW = {
  card: '0 1px 2px rgba(30,20,60,0.05), 0 8px 20px rgba(30,20,60,0.08)',
  cardHover: '0 2px 4px rgba(30,20,60,0.06), 0 14px 30px rgba(30,20,60,0.12)',
  glow: (hex: string) => `0 6px 18px ${hex}55`,
} as const;

// Vidrio esmerilado (header / nav / tarjetas sobre aurora)
export const GLASS = {
  light: { background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.9)' },
  dark:  { background: 'rgba(30,26,44,0.78)',  backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.08)' },
} as const;

// Física de resortes estándar para toda animación de tap/entrada
export const SPRING = { type: 'spring' as const, stiffness: 400, damping: 28 };
export const SPRING_SOFT = { type: 'spring' as const, stiffness: 300, damping: 26 };

// Vibración háptica sutil (silenciosa si el dispositivo no soporta)
export function haptic(ms = 8) {
  try { navigator.vibrate?.(ms); } catch { /* no-op */ }
}

