"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Loader2, ArrowLeft, Video, FileText, Download } from "lucide-react";

export default function CurriculumManager({ courseId, courseTitle, onBack }: { courseId: number, courseTitle: string, onBack: () => void }) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Form State
  const [moduleTitle, setModuleTitle] = useState("");
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [supportFileUrl, setSupportFileUrl] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('lesson_order', { ascending: true })
      .order('id', { ascending: true });
    
    if (error) {
      alert("Error fetching lessons: " + error.message);
    } else {
      setLessons(data || []);
    }
    setIsLoading(false);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Get the next order index
    const nextOrder = lessons.filter(l => l.module_title === moduleTitle).length + 1;

    const newLesson = {
      course_id: courseId,
      module_title: moduleTitle.trim(),
      title: title.trim(),
      video_url: videoUrl.trim() || null,
      pdf_url: pdfUrl.trim() || null,
      support_file_url: supportFileUrl.trim() || null,
      duration: duration.trim() || null,
      lesson_order: nextOrder
    };

    const { data, error } = await supabase
      .from('lessons')
      .insert([newLesson])
      .select()
      .single();

    if (error) {
      alert("Error adding lesson: " + error.message);
    } else if (data) {
      setLessons([...lessons, data]);
      // Reset form (keep module title for quick adding)
      setTitle("");
      setVideoUrl("");
      setPdfUrl("");
      setSupportFileUrl("");
      setDuration("");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting lesson: " + error.message);
    } else {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  // Group lessons by module
  const groupedLessons = lessons.reduce((acc: any, lesson: any) => {
    if (!acc[lesson.module_title]) {
      acc[lesson.module_title] = [];
    }
    acc[lesson.module_title].push(lesson);
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Curriculum Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Managing: <span className="font-semibold">{courseTitle}</span></p>
        </div>
      </div>
      
      {/* Add Lesson Form */}
      <form onSubmit={handleAddLesson} className="mb-8 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Add New Lesson</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Module Title</label>
            <input required type="text" placeholder="e.g. Module 1: Introduction" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Lesson Title</label>
            <input required type="text" placeholder="e.g. Welcome to the course" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Video URL (optional)</label>
            <input type="url" placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Duration (e.g. 5 mins)</label>
            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">PDF URL (optional)</label>
            <input type="url" placeholder="https://..." value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Support File URL (optional)</label>
            <input type="url" placeholder="https://..." value={supportFileUrl} onChange={e => setSupportFileUrl(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
        </div>
        <button type="submit" disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Add Lesson
        </button>
      </form>

      {/* Curriculum List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : Object.keys(groupedLessons).length > 0 ? (
          Object.keys(groupedLessons).map((moduleName, mIdx) => (
            <div key={mIdx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">{moduleName}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {groupedLessons[moduleName].map((lesson: any, lIdx: number) => (
                  <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {lIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                          {lesson.duration && <span>⏱ {lesson.duration}</span>}
                          {lesson.video_url && <span className="flex items-center gap-1 text-blue-600"><Video className="w-3 h-3" /> Video attached</span>}
                          {lesson.pdf_url && <span className="flex items-center gap-1 text-red-500"><FileText className="w-3 h-3" /> PDF attached</span>}
                          {lesson.support_file_url && <span className="flex items-center gap-1 text-green-600"><Download className="w-3 h-3" /> Support File</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            No modules or lessons added to this course yet.
          </p>
        )}
      </div>
    </div>
  );
}
