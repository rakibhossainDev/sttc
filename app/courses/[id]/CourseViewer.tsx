"use client";

import { useState } from "react";
import { PlayCircle, FileText, Download, ChevronRight, ChevronDown } from "lucide-react";

export default function CourseViewer({ course, modules, lessons }: { course: any, modules: any[], lessons: any[] }) {
  const [activeLesson, setActiveLesson] = useState<any | null>(lessons.length > 0 ? lessons[0] : null);
  
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
    // Scroll to top smoothly so mobile users can see the video immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    return null;
  };

  const activeVideoEmbed = activeLesson?.video_url ? getYoutubeEmbedUrl(activeLesson.video_url) : null;

  return (
    <div className="flex flex-col md:flex-row-reverse min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      
      {/* Main Content Area (Right on Desktop, Top on Mobile) */}
      <div className="flex-1 flex flex-col w-full h-full md:overflow-y-auto pb-10 md:pb-0">
        
        {/* Mobile Header Title */}
        <div className="md:hidden bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center shadow-sm">
          <h1 className="font-bold text-gray-900 dark:text-white truncate flex-1">{course.title}</h1>
        </div>

        {activeLesson ? (
          <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-6">
            
            {/* Desktop Header */}
            <div className="hidden md:block space-y-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {activeLesson.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium truncate max-w-sm">
                  {modules.find(m => m.id === activeLesson.module_id)?.title || 'Module'}
                </span>
              </div>
            </div>

            {/* Video Player Area */}
            {activeLesson.video_url && (
              <div className="w-full aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                {activeVideoEmbed ? (
                  <iframe 
                    src={activeVideoEmbed} 
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video 
                    src={activeLesson.video_url} 
                    controls 
                    className="w-full h-full object-contain"
                    controlsList="nodownload"
                  />
                )}
              </div>
            )}

            {/* Mobile Inline Title (Shown below video on mobile) */}
            <div className="md:hidden space-y-2 mt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {activeLesson.title}
              </h2>
              <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                {modules.find(m => m.id === activeLesson.module_id)?.title || 'Module'}
              </span>
            </div>

            {/* Content Text */}
            {activeLesson.content_text && (
              <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-5 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{activeLesson.content_text}</p>
              </div>
            )}

            {/* Action Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
              Select a lesson from the curriculum list to start learning.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar - Course Curriculum (Left on Desktop, Bottom on Mobile) */}
      <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 h-auto md:h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 hidden md:flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="font-bold text-gray-900 dark:text-white truncate">Curriculum</h2>
        </div>
        
        {/* Mobile Curriculum Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Course Curriculum</h2>
          <p className="text-xs text-gray-500 mt-1">Select a lesson below to view its content.</p>
        </div>
        
        <div className="md:overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent">
          {modules.length > 0 ? (
            modules.map((moduleItem, mIdx) => (
              <div key={moduleItem.id} className="border-b border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => toggleModule(moduleItem.id)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors text-left"
                >
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 pr-4">{moduleItem.title}</span>
                  {expandedModules[moduleItem.id] ? <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />}
                </button>
                
                {expandedModules[moduleItem.id] && (
                  <div className="bg-gray-50/50 dark:bg-gray-950">
                    {lessonsByModule[moduleItem.id] ? lessonsByModule[moduleItem.id].map((lesson: any, lIdx: number) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-l-4 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                        >
                          <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                            {lesson.video_url ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className={`text-sm leading-snug ${isActive ? 'font-bold text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
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
      
    </div>
  );
}
