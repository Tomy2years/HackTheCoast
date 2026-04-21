import React from 'react';
import { BookOpen, FileText, BrainCircuit, ExternalLink, Loader2, AlertCircle, Clock, Award } from 'lucide-react';
import { useData } from '../lib/DataContext';

function formatDueDate(isoString) {
  if (!isoString) return null;
  const due = new Date(isoString);
  const now = new Date();
  const diffMs = due - now;
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return 'Past due';
  if (diffHrs < 1) return 'Less than an hour';
  if (diffHrs < 24) return `In ${diffHrs} hour${diffHrs !== 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 14) return 'Next week';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function gradeColor(grade) {
  if (grade === null || grade === undefined) return 'text-neutral-500';
  if (grade >= 90) return 'text-green-400';
  if (grade >= 80) return 'text-blue-400';
  if (grade >= 70) return 'text-yellow-400';
  return 'text-red-400';
}

function gradeBg(grade) {
  if (grade === null || grade === undefined) return 'bg-neutral-800/50 border-neutral-700/50';
  if (grade >= 90) return 'bg-green-500/10 border-green-500/20';
  if (grade >= 80) return 'bg-blue-500/10 border-blue-500/20';
  if (grade >= 70) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

export default function CoursesView({ setActiveTab }) {
  const { courses, coursesLoading: loading, coursesError: error, refreshCourses, setInitialChatQuery } = useData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 animate-in fade-in duration-500">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-neutral-400 text-sm">Loading courses from Canvas…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 animate-in fade-in duration-500">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={refreshCourses}
          className="text-sm text-blue-400 hover:text-blue-300 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Courses</h2>
        <p className="text-neutral-400">
          Live from Canvas &middot; {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#121212] border border-neutral-800 rounded-3xl overflow-hidden group hover:border-blue-900/50 transition-all duration-300 shadow-2xl"
          >
            <div className="p-8">
              {/* Header: icon + grade */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-900/20 text-blue-500 flex items-center justify-center font-bold text-xl border border-blue-500/10">
                  {(course.code || course.name || '??').substring(0, 2).toUpperCase()}
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold tracking-tight ${gradeColor(course.grade)}`}>
                    {course.grade !== null && course.grade !== undefined
                      ? `${Math.round(course.grade)}%`
                      : '—'}
                  </div>
                  <div className="text-sm text-neutral-500 font-medium mt-1">Current Grade</div>
                </div>
              </div>

              {/* Course name + code */}
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white leading-tight truncate mb-1" title={course.code}>
                  {course.code || course.name}
                </h3>
                <p className="text-sm text-neutral-400 font-medium tracking-wide truncate mb-1 uppercase opacity-80">
                  {course.name}
                </p>
                {course.term && (
                  <p className="text-sm text-neutral-500 font-medium">{course.term}</p>
                )}
              </div>

              {/* Info rows */}
              <div className="space-y-5 mb-8">
                {/* Grade bar */}
                <div>
                  <div className="flex justify-between text-sm font-medium text-neutral-400 mb-2">
                    <span>Grade Progress</span>
                    <span className={gradeColor(course.grade)}>{Math.round(course.grade || 0)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        course.grade >= 90
                          ? 'bg-green-500'
                          : course.grade >= 80
                          ? 'bg-blue-500'
                          : course.grade >= 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(course.grade || 0, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Next assignment */}
                <div className="flex items-center gap-3 py-1">
                  <Clock className="w-5 h-5 text-neutral-500 shrink-0" />
                  {course.next_assignment ? (
                    <div className="min-w-0">
                      <span className="text-neutral-300 text-sm block truncate font-medium italic">
                        {course.next_assignment.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-sm italic font-medium">No upcoming assignments</span>
                  )}
                </div>

                {/* Syllabus status */}
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-neutral-500 shrink-0" />
                  <span className="text-neutral-300 text-sm font-medium">Syllabus Indexed</span>
                  <span className="ml-auto text-green-500 text-[10px] font-bold bg-green-500/10 px-3 py-1 rounded-md border border-green-500/20 uppercase tracking-wider">
                    Ready
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setInitialChatQuery(`What are my upcoming deadlines and what do I need to know for ${course.code || course.name}?`);
                    if (setActiveTab) setActiveTab('chat');
                  }}
                  className="w-full bg-[#003870] hover:bg-[#004a94] text-white text-base font-bold py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                  Ask AI About Class
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
