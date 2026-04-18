import React from 'react';
import { BookOpen, FileText, BrainCircuit, ExternalLink } from 'lucide-react';
import { mockCourses } from '../data/mockData';

export default function CoursesView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-neutral-900">My Courses</h2>
        <p className="text-neutral-600">Syllabi automatically indexed and processed for RAG and AI answering.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <div key={course.id} className="bg-white/80 border border-blue-100 rounded-2xl overflow-hidden shadow-sm group hover:border-blue-400 transition-colors backdrop-blur-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xl border border-blue-500/20">
                  {course.code.substring(0, 2)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900">{course.grade}</div>
                  <div className="text-xs text-neutral-500">Current Grade</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 mb-1 truncate">{course.name}</h3>
              <p className="text-sm text-neutral-500 font-mono mb-6">{course.code}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-700">Syllabus Indexed</span>
                  <span className="ml-auto text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded">Ready</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BrainCircuit className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-700">Practice Material</span>
                  <span className="ml-auto text-blue-600 text-xs hover:underline cursor-pointer">Generate</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-xl transition-colors">
                  Ask AI About Class
                </button>
                <button className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors border border-blue-100">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
