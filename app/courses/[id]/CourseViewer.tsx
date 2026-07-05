"use client";

import { useState } from "react";
import { PlayCircle, FileText, Download, ChevronDown, Info, ArrowLeft } from "lucide-react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function CourseViewer({ course, modules, lessons }: { course: any, modules: any[], lessons: any[] }) {
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  
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
    
    // Already an embed link
    if (url.includes('youtube.com/embed/')) return url;

    try {
      const urlObj = new URL(url);
      
      const formatEmbed = (id: string) => {
        const params = new URLSearchParams(urlObj.search);
        params.delete('v');
        if (!params.has('rel')) params.set('rel', '0');
        const queryStr = params.toString();
        return `https://www.youtube.com/embed/${id}${queryStr ? '?' + queryStr : ''}`;
      };

      // Standard and unlisted links: youtube.com/watch?v=...
      if (urlObj.hostname.includes('youtube.com')) {
        const v = urlObj.searchParams.get('v');
        if (v && v.length === 11) return formatEmbed(v);
        
        // Handle shorts
        if (urlObj.pathname.startsWith('/shorts/')) {
          const id = urlObj.pathname.replace('/shorts/', '').split('?')[0];
          if (id && id.length === 11) return formatEmbed(id);
        }
      }
      
      // Shortened links: youtu.be/...
      if (urlObj.hostname.includes('youtu.be')) {
        const id = urlObj.pathname.slice(1).split('?')[0];
        if (id && id.length === 11) return formatEmbed(id);
      }
    } catch (e) {
      // Ignore URL parsing errors and fallback to regex
    }

    // Ultimate fallback regex for any remaining edge cases
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    
    return null;
  };

  const activeVideoEmbed = activeLesson?.video_url ? getYoutubeEmbedUrl(activeLesson.video_url) : null;

  return (
    <div className="flex flex-col md:flex-row-reverse min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950 relative">
      
      {/* Main Content Area (Right on Desktop, Top on Mobile) */}
      <div className={`flex-1 flex-col w-full h-full md:overflow-y-auto pb-10 md:pb-0 ${activeLesson ? 'flex' : 'hidden md:flex'}`}>

        {activeLesson ? (
          <div className="w-full max-w-5xl mx-auto p-0 md:p-8 md:space-y-6">
            
            {/* Desktop Header */}
            <div className="hidden md:block space-y-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
                {activeLesson.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium truncate max-w-sm">
                  {modules.find(m => m.id === activeLesson.module_id)?.title || 'Module'}
                </span>
              </div>
            </div>

            {/* Mobile Inline Title */}
            <div className="md:hidden space-y-2 p-4 pt-5 pb-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
                {activeLesson.title}
              </h2>
              <span className="inline-block bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                {modules.find(m => m.id === activeLesson.module_id)?.title || 'Module'}
              </span>
            </div>

            {/* Clean Conditional Media Rendering */}
            {activeLesson.video_url ? (
              <div className="w-full aspect-video bg-black md:rounded-2xl overflow-hidden md:shadow-lg md:border border-slate-200 dark:border-slate-800 relative z-10 mb-6">
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
            ) : activeLesson.pdf_url ? (
              <div className="w-full px-4 md:px-0 mb-6">
                <div className="w-full h-[75vh] bg-white rounded-xl border border-slate-200 overflow-y-auto relative">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={activeLesson.pdf_url} />
                  </Worker>
                </div>
              </div>
            ) : null}

            {/* Content Text */}
            {activeLesson.content_text && (
              <div className="px-4 md:px-0 mb-6 md:mb-0 mt-4 md:mt-0">
                <div className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">{activeLesson.content_text}</p>
                </div>
              </div>
            )}

            {/* Support File Details Block */}
            {activeLesson.support_file_url && (
              <div className="px-4 md:px-0 mb-6 md:mb-0 mt-4 md:mt-0">
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-5 md:p-6 rounded-xl md:rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">Support Material Available</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                        This lesson includes a downloadable support file (such as a ZIP archive, document, or spreadsheet) to help you follow along with the exercises.
                      </p>
                    </div>
                  </div>
                  <a 
                    href={activeLesson.support_file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download File
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Select a lesson from the curriculum to begin.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar - Course Curriculum (Left on Desktop, Bottom on Mobile) */}
      <div className="w-full md:w-80 lg:w-[400px] bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 h-auto md:h-[calc(100vh-64px)] shadow-lg md:shadow-none z-20">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 hidden md:flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
          <h2 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white truncate">Curriculum</h2>
        </div>
        
        {/* Mobile Curriculum Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 md:hidden">
          <h2 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Course Curriculum</h2>
          <p className="text-sm text-slate-500 mt-1">Select a lesson below to view its content.</p>
        </div>
        
        <div className="md:overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent p-4 space-y-4 bg-slate-50 md:bg-transparent dark:bg-slate-950 md:dark:bg-transparent">
          {modules.length > 0 ? (
            modules.map((moduleItem, mIdx) => {
              const isExpanded = expandedModules[moduleItem.id];
              const hasActiveLesson = lessonsByModule[moduleItem.id]?.some((l: any) => l.id === activeLesson?.id);
              
              return (
              <div key={moduleItem.id} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm' : 'bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                <button 
                  onClick={() => toggleModule(moduleItem.id)}
                  className="w-full flex items-center justify-between p-4 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasActiveLesson ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <span className="font-bold text-sm">{mIdx + 1}</span>
                    </div>
                    <span className="font-bold text-base text-slate-800 dark:text-slate-200 pr-4 tracking-tight">{moduleItem.title}</span>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </button>
                
                <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="pb-4 px-3 pt-1 space-y-1">
                      {lessonsByModule[moduleItem.id] ? lessonsByModule[moduleItem.id].map((lesson: any, lIdx: number) => {
                        const isActive = activeLesson?.id === lesson.id;
                        
                        let Icon = Info;
                        if (lesson.video_url) Icon = PlayCircle;
                        else if (lesson.pdf_url) Icon = FileText;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm ring-1 ring-blue-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                          >
                            <div className={`mt-0.5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className={`text-sm leading-snug tracking-tight ${isActive ? 'font-bold text-blue-700 dark:text-blue-300' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                                {lesson.title}
                              </p>
                            </div>
                          </button>
                        );
                      }) : (
                        <div className="p-3 text-sm text-slate-500 text-center">No lessons in this module.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )})
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              No modules available for this course yet.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
