import React from 'react';
import { Target, Zap, Clock, Loader2 } from 'lucide-react';
import { useData } from '../lib/DataContext';

function formatDueDate(isoString) {
  if (!isoString) return null;
  const due = new Date(isoString);
  const now = new Date();
  const diffMs = due - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return 'Past due';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 14) return 'Next week';
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard() {
  const { courses, coursesLoading, aiSuggestions, suggestionsLoading } = useData();

  // Find courses with upcoming assignments, sorted by due date
  const coursesWithAssignments = courses
    .filter(c => c.next_assignment?.due_at)
    .sort((a, b) => new Date(a.next_assignment.due_at) - new Date(b.next_assignment.due_at));

  const topPriority = coursesWithAssignments[0];
  const upNext = coursesWithAssignments.slice(1, 4);

  // Courses that have grades for the grade maintenance section
  const gradedCourses = courses.filter(c => c.grade !== null && c.grade !== undefined);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2">Workflow Optimizer</h2>
        <p className="text-neutral-400">AI-prioritized schedule based on major requirements and deadlines.</p>
      </div>

      {coursesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-blue-900/30 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-blue-500 w-5 h-5" />
              What to work on right now
            </h3>
            {topPriority ? (
              <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-5 rounded-xl border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Top Priority</span>
                    <h4 className="text-lg font-bold text-white mt-1">
                      {topPriority.code} – {topPriority.next_assignment.name}
                    </h4>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-mono">
                    {formatDueDate(topPriority.next_assignment.due_at)}
                  </span>
                </div>
                <p className="text-sm text-neutral-300">
                  {topPriority.next_assignment.points != null
                    ? `Worth ${topPriority.next_assignment.points} points. `
                    : ''}
                  Current grade: {topPriority.grade != null ? `${Math.round(topPriority.grade * 10) / 10}%` : 'N/A'}.
                </p>
              </div>
            ) : (
              <p className="text-neutral-500 italic">No upcoming assignments found.</p>
            )}
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Up Next</h3>
            <div className="space-y-4">
              {upNext.length > 0 ? upNext.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-neutral-300">
                      {(course.code || '??').substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{course.name.replace(/\s*-\s*\d{5}$/, '')}</h4>
                      <p className="text-sm text-neutral-400">{course.next_assignment.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-200">
                      {formatDueDate(course.next_assignment.due_at)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {course.next_assignment.points != null ? `${course.next_assignment.points} pts` : ''}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-neutral-500 italic text-sm">No more upcoming assignments.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="text-green-500 w-5 h-5" />
              Grade Maintenance
            </h3>
            <div className="space-y-4">
              {gradedCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-300">{course.code}</span>
                    <span className="font-medium text-white">{Math.round(course.grade * 10) / 10}%</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${course.grade >= 90 ? 'bg-green-500' : course.grade >= 80 ? 'bg-blue-500' : course.grade >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${Math.min(course.grade, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" />
              AI Suggestions
            </h3>
            <p className="text-sm text-neutral-400 mb-3">Based on your upcoming deadlines:</p>
            {suggestionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            ) : (
              <ul className="text-sm text-neutral-300 list-disc pl-4 space-y-2">
                {aiSuggestions && aiSuggestions.length > 0 ? (
                  aiSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))
                ) : (
                  <p className="text-neutral-500 italic">No suggestions available.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
