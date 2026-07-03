"use client";

import { useState } from "react";
import { PlayCircle, FileText, Download, Menu, X, ChevronRight, ChevronDown } from "lucide-react";

export default function CourseViewer({ course, modules, lessons }: { course: any, modules: any[], lessons: any[] }) {
  const [activeLesson, setActiveLesson] = useState<any | null>(lessons.length > 0 ? lessons[0] : null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Group lessons by module.id
  const lessonsByModule = lessons.reduce((acc: any, lesson: any) => {
    if (!acc[lesson.module_id]) {
      acc[lesson.module_id] = [];
    }
    acc[lesson.module_id].push(lesson);
    return acc;
  }, {});

  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(
    modules.reduce((acc, module, idx) => ({ ...acc, [module.id]: idx === 0 }), {})
  );

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSelectLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Course Curriculum */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-64px)]`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="font-bold text-gray-900 dark:text-white truncate pr-4">Curriculum</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 pb-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
          {modules.length > 0 ? (
            modules.map((moduleItem, mIdx) => (
              <div key={moduleItem.id} className="border-b border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleModule(moduleItem.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors text-left"
                >
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{moduleItem.title}</span>
                  {expandedModules[moduleItem.id] ? <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />}
                </button>
                
                {expandedModules[moduleItem.id] && (
                  <div className="bg-white dark:bg-gray-900">
                    {lessonsByModule[moduleItem.id] ? lessonsByModule[moduleItem.id].map((lesson: any, lIdx: number) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-l-2 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        >
                          <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                            {lesson.video_url ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`text-sm ${isActive ? 'font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                              {lIdx + 1}. {lesson.title}
                            </p>
                          </div>
                        </button>
                      );
                    }) : (
                      <div className="p-4 text-sm text-gray-500 pl-11">No lessons in this module.</div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No modules available for this course yet.
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Mobile Header Toggle */}
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 sticky top-0 z-30 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-gray-900 dark:text-white truncate flex-1">{course.title}</h1>
        </div>

        {activeLesson ? (
          <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {activeLesson.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium truncate max-w-sm">
                  {modules.find(m => m.id === activeLesson.module_id)?.title || 'Module'}
                </span>
              </div>
            </div>

            {/* Video Player */}
            {activeLesson.video_url && (
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative border border-gray-200 dark:border-gray-800">
                <video 
                  src={activeLesson.video_url} 
                  controls 
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                />
              </div>
            )}

            {/* Content Text */}
            {activeLesson.content_text && (
              <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="whitespace-pre-wrap">{activeLesson.content_text}</p>
              </div>
            )}

            {/* Content & Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeLesson.pdf_url && (
                <a 
                  href={activeLesson.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-red-300 dark:hover:border-red-800/50 hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">View PDF Notes</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Read supplementary material</p>
                  </div>
                </a>
              )}

              {activeLesson.support_file_url && (
                <a 
                  href={activeLesson.support_file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-800/50 hover:shadow-sm transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Download Support File</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Source code & assets</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <PlayCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to {course.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Select a lesson from the curriculum sidebar to start learning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
