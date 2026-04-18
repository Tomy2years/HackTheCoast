import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';

export default function CalendarView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Smart Calendar</h2>
          <p className="text-neutral-400">AI determines when you should start working on things based on your habits.</p>
        </div>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-sm px-4 py-2 rounded-lg border border-neutral-700 transition-colors">
          Sync Canvas
        </button>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-7 border-b border-neutral-800 text-center bg-black/40">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-sm font-medium text-neutral-400">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 h-[500px]">
          {/* Simple mock calendar grid */}
          {Array.from({ length: 35 }).map((_, i) => {
            const date = i - 2; // Offset for demo
            const isToday = date === 23;
            return (
              <div key={i} className={`border-b border-r border-neutral-800/50 p-2 ${isToday ? 'bg-blue-900/10' : ''}`}>
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}>
                  {date > 0 && date <= 31 ? date : ''}
                </span>
                
                {/* Mock Event injection */}
                {date === 23 && (
                  <div className="mt-1 bg-blue-500/20 border border-blue-500/30 rounded p-1 text-[10px] text-blue-300 truncate">
                    Start MATH102
                  </div>
                )}
                {date === 25 && (
                  <div className="mt-1 bg-red-500/20 border border-red-500/30 rounded p-1 text-[10px] text-red-300 truncate">
                    CS101 Due
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="text-blue-500 w-5 h-5" /> Recommended Start Times
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-300">MATH102 Study</span>
              <span className="text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded">Today 6:00 PM</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-300">HIST201 Reading</span>
              <span className="text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded">Tomorrow 2:00 PM</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500 w-5 h-5" /> Hard Deadlines
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-300">CS101 Project 1</span>
              <span className="text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded">Oct 25 11:59 PM</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-neutral-300">MATH102 Midterm</span>
              <span className="text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded">Oct 28 10:00 AM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
