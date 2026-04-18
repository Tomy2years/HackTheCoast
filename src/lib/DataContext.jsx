import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCanvasAPI } from './canvas';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const fetchCourses = useCallback(async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setCoursesError(err.message);
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setAnnouncementsLoading(true);
      setAnnouncementsError(null);
      
      const res = await fetch('/api/announcements');
      if (!res.ok) throw new Error(`Failed to load announcements (${res.status})`);
      const raw = await res.json();
      
      const formatted = raw.map(a => ({
        ...a,
        date: new Date(a.date).toLocaleDateString(),
      }));
      setAnnouncements(formatted);
    } catch (err) {
      setAnnouncementsError(err.message);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, []);

  const addChatMessage = (role, content) => {
    setChatMessages(prev => [...prev, { role, content }]);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  // Fetch everything once on mount
  useEffect(() => {
    fetchCourses();
    fetchAnnouncements();
  }, [fetchCourses, fetchAnnouncements]);

  const value = {
    courses,
    announcements,
    coursesLoading,
    announcementsLoading,
    coursesError,
    announcementsError,
    chatMessages,
    addChatMessage,
    clearChat,
    refreshCourses: fetchCourses,
    refreshAnnouncements: fetchAnnouncements,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
