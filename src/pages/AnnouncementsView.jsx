import React, { useState } from 'react';
import { Bell, Sparkles, Filter, ChevronDown } from 'lucide-react';
import { mockAnnouncements } from '../data/mockData';

export default function AnnouncementsView() {
  const [summarizedId, setSummarizedId] = useState(null);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  const handleSummarize = (id) => {
    setSummarizedId(summarizedId === id ? null : id);
  };

  const handleMarkAsRead = (id) => {
    setReadAnnouncements((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold mb-2">Automated Announcements</h2>
          <p className="text-neutral-400">Long announcements summarized instantly by AI.</p>
        </div>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-sm px-4 py-2 rounded-lg border border-neutral-700 transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="space-y-4">
        {mockAnnouncements
          .filter((announcement) => !readAnnouncements.includes(announcement.id))
          .map((announcement) => {
          const isSummarized = summarizedId === announcement.id;
          
          return (
            <div key={announcement.id} className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-md transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600/20 text-blue-500 text-xs font-bold px-2 py-1 rounded">
                    {announcement.course}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Bell className="w-3 h-3" /> {announcement.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSummarize(announcement.id)}
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border ${
                      isSummarized 
                        ? 'bg-blue-600 text-white border-blue-500' 
                        : 'bg-gray-200 text-blue-600 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {isSummarized ? 'Show Original' : 'AI Summarize'}
                  </button>
                  <button 
                    onClick={() => handleMarkAsRead(announcement.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-blue-900 mb-2">{announcement.title}</h3>
              
              <div className="relative">
                {isSummarized ? (
                  <div className="bg-blue-500/10 border-l-2 border-blue-500 pl-4 py-2 mt-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-blue-800 text-sm font-medium">✨ AI Summary:</p>
                    <ul className="list-disc pl-4 mt-2 text-neutral-700 text-sm space-y-1">
                      {announcement.id === 1 && (
                        <>
                          <li>Midterm format changed to open notes/book.</li>
                          <li>Bring fully charged laptop for lockdown browser.</li>
                          <li>Focus on study guide questions 4 & 5.</li>
                        </>
                      )}
                      {announcement.id === 2 && (
                        <>
                          <li>HW4 deadline extended by 48 hours due to server outage.</li>
                          <li>Contact TAs if you need help.</li>
                        </>
                      )}
                      {announcement.id === 3 && (
                        <>
                          <li>Guest speaker tomorrow.</li>
                          <li>Mandatory attendance.</li>
                          <li>Short quiz at the end of class.</li>
                        </>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="text-blue-900 leading-relaxed">
                    {announcement.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
