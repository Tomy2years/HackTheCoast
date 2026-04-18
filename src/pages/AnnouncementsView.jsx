import React, { useState } from 'react';
import { Bell, Sparkles, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { getCanvasAPI } from '../lib/canvas';
import { useData } from '../lib/DataContext';

export default function AnnouncementsView() {
  const { announcements, announcementsLoading: loading, announcementsError: error, refreshAnnouncements } = useData();
  const [summaries, setSummaries] = useState({});
  const [summarizingId, setSummarizingId] = useState(null);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  const handleSummarize = async (announcement) => {
    if (summaries[announcement.id]) {
      // Toggle off
      const newSummaries = { ...summaries };
      delete newSummaries[announcement.id];
      setSummaries(newSummaries);
      return;
    }

    try {
      setSummarizingId(announcement.id);
      const canvasApi = getCanvasAPI();
      const response = await canvasApi.fetch('/announcements/summarize', {
        method: 'POST',
        body: JSON.stringify({ content: announcement.content })
      });
      setSummaries(prev => ({ ...prev, [announcement.id]: response.summary }));
    } catch (err) {
      console.error(err);
      alert("Failed to summarize: " + err.message);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleMarkAsRead = (id) => {
    setReadAnnouncements((prev) => [...prev, id]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-red-500 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Failed to load announcements</h3>
          <p className="text-sm">{error}. Please check your Settings.</p>
        </div>
      </div>
    );
  }

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
        {announcements
          .filter((announcement) => !readAnnouncements.includes(announcement.id))
          .map((announcement) => {
          const isSummarized = !!summaries[announcement.id];
          const isSummarizing = summarizingId === announcement.id;
          
          return (
            <div key={announcement.id} className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-md transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600/20 text-blue-500 text-xs font-bold px-2 py-1 rounded">
                    {announcement.course.replace('course_', 'Course ')}
                  </span>
                  <span className="text-neutral-500 text-sm flex items-center gap-1">
                    <Bell className="w-3 h-3" /> {announcement.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSummarize(announcement)}
                    disabled={isSummarizing}
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors border disabled:opacity-50 ${
                      isSummarized 
                        ? 'bg-blue-600 text-white border-blue-500' 
                        : 'bg-gray-200 text-blue-600 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {isSummarizing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
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
                    <p className="text-blue-800 text-sm font-medium mb-2">✨ AI Summary:</p>
                    <ul className="list-disc pl-4 text-neutral-700 text-sm space-y-1">
                      {summaries[announcement.id].map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-blue-900 leading-relaxed line-clamp-3">
                    {announcement.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {announcements.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No active announcements found.
          </div>
        )}
      </div>
    </div>
  );
}
