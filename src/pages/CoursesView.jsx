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

export default function CoursesView() {
  const { courses, coursesLoading: loading, coursesError: error, refreshCourses } = useData();

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
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="p-6">
              {/* Header: icon + grade */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-lg border border-blue-500/20">
                  {(course.code || '??').substring(0, 2)}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${gradeColor(course.grade)}`}>
                    {course.grade !== null && course.grade !== undefined
                      ? `${Math.round(course.grade * 10) / 10}%`
                      : '—'}
                  </div>
                  <div className="text-xs text-neutral-500">Current Grade</div>
                </div>
              </div>

              {/* Course name + code */}
              <h3 className="text-xl font-bold text-white mb-1 truncate" title={course.name}>
                {course.name.replace(/\s*-\s*\d{5}$/, '')}
              </h3>
              <p className="text-sm text-neutral-400 font-mono mb-1">{course.code}</p>
              {course.term && (
                <p className="text-xs text-neutral-500 mb-5">{course.term}</p>
              )}
              {!course.term && <div className="mb-5" />}

              {/* Info rows */}
              <div className="space-y-3 mb-6">
                {/* Grade bar */}
                {course.grade !== null && course.grade !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span>Grade Progress</span>
                      <span className={gradeColor(course.grade)}>{Math.round(course.grade)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
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
                        style={{ width: `${Math.min(course.grade, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Next assignment */}
                {course.next_assignment ? (
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-neutral-300 block truncate">{course.next_assignment.name}</span>
                      <span className="text-xs text-neutral-500">
                        {formatDueDate(course.next_assignment.due_at)}
                        {course.next_assignment.points != null && ` · ${course.next_assignment.points} pts`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span className="text-neutral-500 italic">No upcoming assignments</span>
                  </div>
                )}

                {/* Syllabus status */}
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-300">Syllabus Indexed</span>
                  <span className="ml-auto text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-xl transition-colors">
                  Ask AI About Class
                </button>
                <button className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl flex items-center justify-center transition-colors">
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
