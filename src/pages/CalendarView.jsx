import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../lib/DataContext';

export default function CalendarView() {
  const { assignments } = useData();
  const [filter, setFilter] = useState('both');

  const events = [];
  assignments.forEach(a => {
    if (a.due_at && (filter === 'due' || filter === 'both')) {
      const d = new Date(a.due_at);
      events.push({
        id: a.id + '-due',
        title: `${a.course_code || ''} ${a.name} Due`.trim(),
        date: a.due_at,
        time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
        type: 'deadline',
      });
    }
    if (a.start_at && (filter === 'start' || filter === 'both')) {
      const d = new Date(a.start_at);
      events.push({
        id: a.id + '-start',
        title: `Start ${a.course_code || ''} ${a.name}`.trim(),
        date: a.start_at,
        time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
        type: 'start_time',
      });
    }
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const gridCells = Array.from({ length: 35 }); // Keep it 5 weeks for consistent UI or calculate dynamically

  const startEventsUpcoming = assignments.filter(a => a.start_at && new Date(a.start_at) >= new Date(today.setHours(0,0,0,0))).sort((a,b) => new Date(a.start_at) - new Date(b.start_at)).slice(0, 3);
  const upcomingDeadlines = assignments.filter(a => a.due_at && new Date(a.due_at) >= new Date(today.setHours(0,0,0,0))).sort((a,b) => new Date(a.due_at) - new Date(b.due_at)).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Smart Calendar</h2>
          <p className="text-neutral-400">AI determines when you should start working on things based on your habits.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('both')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'both' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-700/50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('start')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'start' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-700/50'}`}
            >
              Start Dates
            </button>
            <button 
              onClick={() => setFilter('due')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${filter === 'due' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-700/50'}`}
            >
              Due Dates
            </button>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-7 border-b border-neutral-800 text-center bg-black/40">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-sm font-medium text-neutral-400">{day}</div>
          ))}
        </div>
        <div key={filter} className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] min-h-[500px]">
          {gridCells.map((_, i) => {
            const dateNum = i - firstDay + 1;
            const isCurrentMonth = dateNum > 0 && dateNum <= daysInMonth;
            const dateObj = isCurrentMonth ? new Date(currentYear, currentMonth, dateNum) : null;
            const isToday = isCurrentMonth && dateObj?.toDateString() === new Date().toDateString();
            
            const dayEvents = isCurrentMonth ? events.filter(e => {
              const matchesDate = new Date(e.date).toDateString() === dateObj.toDateString();
              const matchesFilter = filter === 'both' ? true : (filter === 'due' ? e.type === 'deadline' : e.type === 'start_time');
              return matchesDate && matchesFilter;
            }) : [];

            return (
              <div key={i} className={`border-b border-r border-neutral-800/50 p-2 min-h-[100px] ${isToday ? 'bg-blue-900/10' : ''}`}>
                {isCurrentMonth ? (
                  <>
                    <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}>
                      {dateNum}
                    </span>
                    <div className="space-y-1">
                      {dayEvents.map(e => (
                         <div key={e.id} className={`rounded p-1 text-[10px] break-words leading-tight ${e.type === 'deadline' ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'}`}>
                           {e.time} - {e.title}
                         </div>
                      ))}
                    </div>
                  </>
                ) : null}
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
            {startEventsUpcoming.length > 0 ? startEventsUpcoming.map((a, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-2">
                <span className="text-neutral-300">{a.course_code} {a.name}</span>
                <span className="text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded w-fit">
                  {new Date(a.start_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </li>
            )) : (
              <p className="text-neutral-500 italic text-sm">No upcoming starts.</p>
            )}
          </ul>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-red-500 w-5 h-5" /> Hard Deadlines
          </h3>
          <ul className="space-y-3">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((a, idx) => (
              <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-2">
                <span className="text-neutral-300">{a.course_code} {a.name}</span>
                <span className="text-red-400 font-medium bg-red-500/10 px-2 py-1 rounded w-fit">
                  {new Date(a.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </li>
            )) : (
               <p className="text-neutral-500 italic text-sm">No upcoming deadlines.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
