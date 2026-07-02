"use client";

import { useState } from 'react';
import { PlayCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
  id: number;
  title: string;
  video_url: string | null;
  pdf_url: string | null;
  duration: string | null;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Props {
  modules: Module[];
}

export default function CourseCurriculum({ modules }: Props) {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [modules[0]?.title || '']: true
  });

  const toggleModule = (title: string) => {
    setOpenModules(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="space-y-4 pb-6">
      {modules.map((mod, index) => {
        const isOpen = openModules[mod.title];
        
        return (
          <div key={index} className="bg-white rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all">
            <button 
              onClick={() => toggleModule(mod.title)}
              className="w-full bg-gray-50/50 hover:bg-gray-50 transition-colors border-b border-gray-100 px-5 py-4 flex items-center justify-between cursor-pointer"
            >
              <h3 className="font-semibold text-gray-800 text-left">{mod.title}</h3>
              <div className="text-gray-400 bg-white p-1 rounded-full shadow-sm">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>
            
            {isOpen && (
              <div className="divide-y divide-gray-50">
                {mod.lessons.map((lesson) => (
                  <Link href={`/play/${lesson.id}`} key={lesson.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100 group">
                    <div className="mr-4 flex-shrink-0 group-hover:scale-105 transition-transform">
                      {lesson.video_url ? (
                        <PlayCircle className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                      ) : (
                        <FileText className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {lesson.video_url ? 'Video' : 'PDF'} {lesson.duration ? `- ${lesson.duration}` : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
