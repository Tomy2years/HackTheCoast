import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCanvasAPI } from './canvas';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [initialChatQuery, setInitialChatQuery] = useState('');

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

  const fetchAssignments = useCallback(async () => {
    try {
      setAssignmentsLoading(true);
      const res = await fetch('/api/assignments');
      if (!res.ok) throw new Error(`Failed to load assignments (${res.status})`);
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAssignmentsLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      setSuggestionsLoading(true);
      const res = await fetch('/api/suggestions');
      if (!res.ok) throw new Error(`Failed to load suggestions (${res.status})`);
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSuggestionsLoading(false);
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
    fetchAssignments();
    fetchSuggestions();
  }, [fetchCourses, fetchAnnouncements, fetchAssignments, fetchSuggestions]);

  const value = {
    courses,
    announcements,
    assignments,
    aiSuggestions,
    coursesLoading,
    announcementsLoading,
    assignmentsLoading,
    suggestionsLoading,
    coursesError,
    announcementsError,
    chatMessages,
    addChatMessage,
    clearChat,
    initialChatQuery,
    setInitialChatQuery,
    refreshCourses: fetchCourses,
    refreshAnnouncements: fetchAnnouncements,
    refreshAssignments: fetchAssignments,
    refreshSuggestions: fetchSuggestions,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
