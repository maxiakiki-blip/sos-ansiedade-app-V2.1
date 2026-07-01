import React from 'react';
import { motion } from 'motion/react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center py-3 px-4 select-none flex-1 relative"
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1"
        animate={isActive ? {
          background: 'linear-gradient(135deg, #b388c4, #9d6eb5)',
          boxShadow: '0 4px 14px rgba(179,136,196,0.45)',
          scale: 1.08,
        } : {
          background: 'transparent',
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          scale: 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.div
          animate={{ color: isActive ? '#ffffff' : '#94a3b8' }}
          transition={{ duration: 0.15 }}
        >
          {icon}
        </motion.div>
      </motion.div>

      <motion.span
        className="text-[10px] leading-none font-black tracking-wide"
        animate={{ color: isActive ? '#b388c4' : '#94a3b8' }}
        transition={{ duration: 0.15 }}
      >
        {label}
      </motion.span>

      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-1 w-1 h-1 rounded-full"
          style={{ background: '#b388c4' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </motion.button>
  );
}
