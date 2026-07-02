import React from 'react';
import { AlertCircle, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import NavButton from '../NavButton';
import { haptic } from '../../theme';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSuperadmin: boolean;
}

/** Barra inferior con vidrio esmerilado — única navegación de la app */
export default function BottomNav({ activeTab, onTabChange, isSuperadmin }: BottomNavProps) {
  const go = (tab: string) => { haptic(); onTabChange(tab); };
  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto flex justify-around">
        <NavButton icon={<AlertCircle className="w-5 h-5" />} label="Resgate" isActive={activeTab === 'rescate'} onClick={() => go('rescate')} />
        <NavButton icon={<ShieldCheck className="w-5 h-5" />} label="Prevenção" isActive={activeTab === 'prevencion'} onClick={() => go('prevencion')} />
        <NavButton icon={<TrendingUp className="w-5 h-5" />} label="Progresso" isActive={activeTab === 'progreso'} onClick={() => go('progreso')} />
        {isSuperadmin && (
          <NavButton icon={<Users className="w-5 h-5" />} label="Admin" isActive={activeTab === 'admin'} onClick={() => go('admin')} />
        )}
      </div>
    </nav>
  );
}
