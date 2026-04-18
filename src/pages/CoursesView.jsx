import React from 'react';
import { BookOpen, FileText, BrainCircuit, ExternalLink } from 'lucide-react';
import { mockCourses } from '../data/mockData';

export default function CoursesView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2">My Courses</h2>
        <p className="text-neutral-400">Syllabi automatically indexed and processed for RAG and AI answering.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <div key={course.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-blue-900/50 transition-colors">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xl border border-blue-500/20">
                  {course.code.substring(0, 2)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{course.grade}</div>
                  <div className="text-xs text-neutral-500">Current Grade</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 truncate">{course.name}</h3>
              <p className="text-sm text-neutral-400 font-mono mb-6">{course.code}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-300">Syllabus Indexed</span>
                  <span className="ml-auto text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded">Ready</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BrainCircuit className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-300">Practice Material</span>
                  <span className="ml-auto text-blue-400 text-xs hover:underline cursor-pointer">Generate</span>
                </div>
              </div>

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
