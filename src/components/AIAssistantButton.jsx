import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIAssistantButton({ onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] ${
        isActive 
          ? 'bg-neutral-100 text-neutral-900 ring-2 ring-white/50' 
          : 'bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-900'
      }`}
    >
      <Sparkles className="w-6 h-6"/>
      Talk to AI
    </button>
  );
}
