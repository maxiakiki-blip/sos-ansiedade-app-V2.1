import { useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'sos_theme';

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

/**
 * Dark mode opcional por usuario:
 *  - 'auto' (default): sigue el modo del sistema del dispositivo
 *  - 'light' / 'dark': elección manual, persistida en el dispositivo
 * Aplica la clase `dark` en <html> y sincroniza <meta name="theme-color">.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      return saved === 'light' || saved === 'dark' ? saved : 'auto';
    } catch { return 'auto'; }
  });

  const isDark = mode === 'dark' || (mode === 'auto' && systemPrefersDark());

  // Reaccionar a cambios del sistema cuando está en auto
  const [, forceRender] = useState(0);
  useEffect(() => {
    if (mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => forceRender(n => n + 1);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#17141f' : '#b388c4');
  }, [isDark]);

  const toggle = useCallback(() => {
    setMode(prev => {
      // Ciclo simple percibido por el usuario: claro ↔ oscuro
      const next: ThemeMode = (prev === 'dark' || (prev === 'auto' && systemPrefersDark())) ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* no-op */ }
      return next;
    });
  }, []);

  return { mode, isDark, toggle };
}

