import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import CoursesView from './pages/CoursesView';
import AnnouncementsView from './pages/AnnouncementsView';
import ChatView from './pages/ChatView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <CalendarView />;
      case 'courses': return <CoursesView />;
      case 'announcements': return <AnnouncementsView />;
      case 'chat': return <ChatView />;
      default: return <Dashboard />;
    }
  };

  const isChat = activeTab === 'chat';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isChat ? 'bg-neutral-950 text-white' : 'bg-blue-50 text-neutral-900'} selection:bg-blue-500/50 overflow-hidden`}>
      <div className="relative z-10 flex h-screen">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <main className={`flex-1 transition-all duration-300 ${isChat ? 'h-screen' : 'overflow-y-auto'}`}>
          <div className={`${isChat ? 'h-full' : 'max-w-6xl mx-auto p-12 pl-72'}`}>
            {renderTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
