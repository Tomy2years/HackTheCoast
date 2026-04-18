import React from 'react';
import { Target, Zap, Clock } from 'lucide-react';
import { mockCourses } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2">Workflow Optimizer</h2>
        <p className="text-neutral-400">AI-prioritized schedule based on major requirements and deadlines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-blue-900/30 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-blue-500 w-5 h-5" />
              What to work on right now
            </h3>
            <div className="bg-gradient-to-r from-blue-600/20 to-transparent p-5 rounded-xl border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Top Priority</span>
                  <h4 className="text-lg font-bold text-white mt-1">CS101 - Project 1: Binary Trees</h4>
                </div>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-mono">Due in 3 Days</span>
              </div>
              <p className="text-sm text-neutral-300">
                AI Insight: This is a major-specific requirement worth 20% of your grade. You need a 91% to maintain your A. Start coding the base structures today.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Up Next</h3>
            <div className="space-y-4">
              {mockCourses.slice(1).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-neutral-300">
                      {course.code.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{course.name}</h4>
                      <p className="text-sm text-neutral-400">{course.nextAssignment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-200">{course.dueDate}</div>
                    <div className="text-xs text-neutral-500">{course.importance}</div>
                  </div>
                </div>
              ))}
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
              {mockCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-300">{course.code}</span>
                    <span className="font-medium text-white">{course.grade}</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${parseFloat(course.grade) > 90 ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: course.grade }}
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
            <p className="text-sm text-neutral-400 mb-3">Based on your recent syllabus uploads:</p>
            <ul className="text-sm text-neutral-300 list-disc pl-4 space-y-2">
              <li>Read chapters 4-5 of History before tomorrow's guest speaker.</li>
              <li>Calculus homework extension means you can prioritize CS today.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
