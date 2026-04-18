import React from 'react';
import { LayoutDashboard, Calendar, BookOpen, Bell, Brush } from 'lucide-react';
import AIAssistantButton from './AIAssistantButton';

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <nav className="w-64 bg-gradient-to-b from-blue-900 to-black border-r border-blue-900/50 h-screen fixed left-0 top-0 flex flex-col pt-8 shadow-xl">
      <div className="px-6 mb-12">
        <div className="flex items-center">
          <h1 className="text-4xl font-black text-white">
            Portrait
          </h1>
          <Brush className="w-8 h-8 text-white ml-2 -rotate-12" />
        </div>
        <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest font-bold">a better canvas</p>
      </div>
      
      <div className="flex flex-col gap-2 px-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-500 font-medium' 
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-neutral-500'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pb-8 w-full flex justify-center px-4">
        <div className="w-full max-w-[200px]">
          <AIAssistantButton 
            isActive={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
        </div>
      </div>
    </nav>
  );
}
