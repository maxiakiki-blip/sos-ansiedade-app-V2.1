import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center py-3 px-4 transition-all select-none active:scale-95 flex-1"
    >
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300"
        style={isActive ? {
          background: 'linear-gradient(135deg, #b388c4, #9d6eb5)',
          boxShadow: '0 4px 12px rgba(179,136,196,0.4)',
          transform: 'scale(1.05)',
        } : {
          background: 'transparent',
        }}
      >
        <div style={{ color: isActive ? 'white' : '#94a3b8' }}>
          {icon}
        </div>
      </div>
      <span
        className="text-[10px] leading-none font-black tracking-wide transition-colors"
        style={{ color: isActive ? '#b388c4' : '#94a3b8' }}
      >
        {label}
      </span>
    </button>
  );
}
