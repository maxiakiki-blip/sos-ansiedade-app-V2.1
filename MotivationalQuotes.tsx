import React from 'react';
import { XCircle } from 'lucide-react';

interface HeaderBackProps {
  onBack: () => void;
  title: string;
}

export default function HeaderBack({ onBack, title }: HeaderBackProps) {
  return (
    <div className="flex items-center mb-5 relative justify-center">
      <button 
        onClick={onBack}
        className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 absolute left-0"
      >
        <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-500" />
      </button>
      <h2 className="text-sm font-black text-[#1e293b]">{title}</h2>
    </div>
  );
}
