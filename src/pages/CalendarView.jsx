import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';
import WeeklyView from '../components/WeeklyView';

export default function CalendarView() {
  const [view, setView] = useState('monthly');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-neutral-900">Smart Calendar</h2>
            <p className="text-neutral-600">AI determines when you should start working on things based on your habits.</p>
          </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-blue-100 p-1 rounded-lg shadow-sm">
            <button 
              onClick={() => setView('monthly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'monthly' ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:bg-blue-50'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setView('weekly')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'weekly' ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:bg-blue-50'}`}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      <div className="bg-transparent border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-blue-200 text-center bg-blue-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-sm font-bold text-blue-900">{day}</div>
          ))}
        </div>
        {view === 'monthly' ? (
          <div className="grid grid-cols-7 grid-rows-5 h-[500px]">
            {Array.from({ length: 35 }).map((_, i) => {
              const date = i - 2; // Offset for demo
              const isToday = date === 23;
              return (
                <div key={i} className={`border-b border-r border-blue-200 p-2 transition-colors hover:bg-blue-50/50 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-400'}`}>
                    {date > 0 && date <= 31 ? date : ''}
                  </span>

                  {/* Mock Event injection */}
                  {date === 23 && (
                    <div className="mt-1 bg-blue-100 border border-blue-200 rounded p-1 text-[10px] text-blue-700 font-medium truncate">
                      Start MATH102
                    </div>
                  )}
                  {date === 25 && (
                    <div className="mt-1 bg-red-100 border border-red-200 rounded p-1 text-[10px] text-red-700 font-medium truncate">
                      CS101 Due
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <WeeklyView events={mockCalendarEvents} />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 border border-blue-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
            <Clock className="text-blue-600 w-5 h-5" /> Recommended Start Times
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-medium">MATH102 Study</span>
              <span className="text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded">Today 6:00 PM</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-medium">HIST201 Reading</span>
              <span className="text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded">Tomorrow 2:00 PM</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/80 border border-blue-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900">
            <AlertCircle className="text-red-600 w-5 h-5" /> Hard Deadlines
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-medium">CS101 Project 1</span>
              <span className="text-red-700 font-bold bg-red-100 px-2 py-1 rounded">Oct 25 11:59 PM</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-medium">MATH102 Midterm</span>
              <span className="text-red-700 font-bold bg-red-100 px-2 py-1 rounded">Oct 28 10:00 AM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
