"use client";

import { useState } from 'react';
import { Play, Download, User, ArrowLeft, FileText } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  video_url: string | null;
  pdf_url: string | null;
  module_title: string;
  duration?: string;
}

interface Course {
  instructor_name: string;
  description: string | null;
}

interface Props {
  currentLesson: Lesson;
  course: Course;
  otherResources: Lesson[];
}

export default function VideoPlayerUI({ currentLesson, course, otherResources }: Props) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  // Combine current lesson PDF with other resources if they exist
  let allResources = [...otherResources];
  if (currentLesson.pdf_url && !allResources.some(r => r.id === currentLesson.id)) {
    allResources.unshift(currentLesson);
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Video Player Placeholder - Sticky on mobile */}
      <div className="sticky top-16 lg:top-0 z-30 w-full aspect-video bg-slate-900 lg:rounded-2xl shadow-xl flex items-center justify-center group overflow-hidden relative">
        {currentLesson.video_url ? (
           <video src={currentLesson.video_url} controls className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <button className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white transform group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 fill-current" />
            </button>
            {currentLesson.pdf_url && (
              <p className="absolute bottom-4 text-white text-sm font-bold drop-shadow-md">No video available. View PDF in Resources.</p>
            )}
          </>
        )}
      </div>

      <div className="px-4 lg:px-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
        
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 mt-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Overview
            {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'resources' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Resources
            {activeTab === 'resources' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {course.description || `In this module: ${currentLesson.module_title}, you will learn the core concepts required to advance your skills.`}
              </p>
              
              {/* Instructor Profile */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Instructor</p>
                  <h3 className="font-bold text-gray-900">{course.instructor_name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Instructor</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-3">
              {!selectedPdf ? (
                <>
                  {allResources.length > 0 ? allResources.map((res) => (
                    <div 
                      key={res.id}
                      onClick={() => {
                        if (res.pdf_url) setSelectedPdf(res.pdf_url);
                      }}
                      className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                          <FileText className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{res.title} (PDF)</p>
                          <p className="text-xs text-gray-500 font-medium">{res.duration || 'Document'}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:bg-blue-50 p-2.5 rounded-full transition-colors active:bg-blue-100">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic">No resources attached to this course.</p>
                  )}
                </>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setSelectedPdf(null)}
                      className="flex items-center text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Resources
                    </button>
                    <a 
                      href={selectedPdf}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Download
                    </a>
                  </div>
                  <iframe 
                    src={selectedPdf} 
                    className="w-full h-[500px] md:h-[600px] rounded-lg border border-gray-200 bg-gray-50"
                    title="PDF Viewer"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
