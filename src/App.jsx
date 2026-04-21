import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import CoursesView from './pages/CoursesView';
import AnnouncementsView from './pages/AnnouncementsView';
import ChatView from './pages/ChatView';
import { DataProvider } from './lib/DataContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <CalendarView />;
      case 'courses': return <CoursesView setActiveTab={setActiveTab} />;
      case 'announcements': return <AnnouncementsView />;
      case 'chat': return <ChatView />;
      default: return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div class="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/50">
        <div className="relative z-10 flex">
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          <main className="flex-1 transition-all duration-300">
            <div className="max-w-6xl mx-auto p-12 pl-72">
              {renderTab()}
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
