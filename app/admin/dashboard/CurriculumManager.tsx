"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Loader2, ArrowLeft, Video, FileText, Download, FolderPlus, PlayCircle } from "lucide-react";

export default function CurriculumManager({ courseId, courseTitle, onBack }: { courseId: number, courseTitle: string, onBack: () => void }) {
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Module Form State
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // Lesson Form State
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [supportFile, setSupportFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  const fetchCurriculum = async () => {
    setIsLoading(true);
    
    // Fetch Modules
    const { data: modsData, error: modsErr } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });
      
    if (modsErr) alert("Error fetching modules: " + modsErr.message);
    else setModules(modsData || []);

    // Fetch Lessons (if there are modules)
    if (modsData && modsData.length > 0) {
      const moduleIds = modsData.map(m => m.id);
      const { data: lessData, error: lessErr } = await supabase
        .from('lessons_new')
        .select('*')
        .in('module_id', moduleIds)
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });
        
      if (lessErr) alert("Error fetching lessons: " + lessErr.message);
      else setLessons(lessData || []);
    }
    
    setIsLoading(false);
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const nextOrder = modules.length + 1;
    
    const { data, error } = await supabase
      .from('modules')
      .insert([{ course_id: courseId, title: newModuleTitle.trim(), sort_order: nextOrder }])
      .select()
      .single();

    if (error) {
      alert("Error adding module: " + error.message);
    } else if (data) {
      setModules([...modules, data]);
      setNewModuleTitle("");
      setShowModuleForm(false);
    }
    setIsSaving(false);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return alert("Please select a module");
    setIsSaving(true);

    let finalPdfUrl = null;
    let finalSupportFileUrl = null;

    try {
      if (pdfFile) {
        const fd = new FormData();
        fd.append("file", pdfFile);
        fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
        fd.append("resource_type", "auto");
        fd.append("type", "upload");
        fd.append("access_mode", "public");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: "POST", body: fd });
        if (!res.ok) throw new Error("Failed to upload PDF to Cloudinary");
        const data = await res.json();
        finalPdfUrl = data.secure_url;
      }
      if (supportFile) {
        const fd = new FormData();
        fd.append("file", supportFile);
        fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
        fd.append("resource_type", "auto");
        fd.append("type", "upload");
        fd.append("access_mode", "public");
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: "POST", body: fd });
        if (!res.ok) throw new Error("Failed to upload Support File to Cloudinary");
        const data = await res.json();
        finalSupportFileUrl = data.secure_url;
      }
    } catch (err: any) {
      alert(err.message);
      setIsSaving(false);
      return;
    }

    const nextOrder = lessons.filter(l => l.module_id === parseInt(selectedModuleId)).length + 1;

    const newLesson = {
      module_id: parseInt(selectedModuleId),
      title: lessonTitle.trim(),
      content_text: contentText.trim() || null,
      video_url: videoUrl.trim() || null,
      pdf_url: finalPdfUrl,
      support_file_url: finalSupportFileUrl,
      sort_order: nextOrder
    };

    try {
      const { data, error } = await supabase
        .from('lessons_new')
        .insert([newLesson])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      } else if (data) {
        setLessons([...lessons, data]);
        setLessonTitle("");
        setContentText("");
        setVideoUrl("");
        setPdfFile(null);
        setSupportFile(null);
        setShowLessonForm(false);
      }
    } catch (err: any) {
      alert("Error adding lesson: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm("Delete this module and ALL its lessons? This cannot be undone.")) return;
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) alert("Error deleting module: " + error.message);
    else {
      setModules(modules.filter(m => m.id !== id));
      setLessons(lessons.filter(l => l.module_id !== id));
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const { error } = await supabase.from('lessons_new').delete().eq('id', id);
    if (error) alert("Error deleting lesson: " + error.message);
    else setLessons(lessons.filter(l => l.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Curriculum Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Managing: <span className="font-semibold">{courseTitle}</span></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setShowModuleForm(!showModuleForm); setShowLessonForm(false); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showModuleForm ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
          >
            <FolderPlus className="w-4 h-4" /> {showModuleForm ? "Cancel Module" : "New Module"}
          </button>
          <button 
            onClick={() => { setShowLessonForm(!showLessonForm); setShowModuleForm(false); }}
            disabled={modules.length === 0}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 ${showLessonForm ? 'bg-gray-100 text-gray-700' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
          >
            <PlayCircle className="w-4 h-4" /> {showLessonForm ? "Cancel Lesson" : "New Lesson"}
          </button>
        </div>
      </div>
      
      {/* Add Module Form */}
      {showModuleForm && (
        <form onSubmit={handleAddModule} className="mb-6 bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">Module Title</label>
            <input required type="text" placeholder="e.g. Module 1: Introduction" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
          </div>
          <button type="submit" disabled={isSaving || !newModuleTitle.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Module"}
          </button>
        </form>
      )}

      {/* Add Lesson Form */}
      {showLessonForm && (
        <form onSubmit={handleAddLesson} className="mb-8 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Add New Lesson
            </h3>
            <p className="text-sm text-gray-500 mt-1">Create a new lesson and upload related media assets.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Lesson Title / Caption <span className="text-red-500">*</span></label>
              <input required type="text" placeholder="e.g. 1.1 Introduction to Competency-Based Training" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Select Module <span className="text-red-500">*</span></label>
              <select required value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none">
                <option value="">Choose a module...</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Video URL (optional)</label>
              <input type="url" placeholder="e.g. YouTube embed or raw MP4" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Text Content (optional)</label>
              <textarea placeholder="Write lesson notes, description, or instructions..." value={contentText} onChange={e => setContentText(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none" rows={3} />
            </div>

            {/* Cloudinary Upload Wrappers */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
                <FileText className="w-4 h-4" /> PDF Notes File (Cloudinary)
              </label>
              <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors file:cursor-pointer cursor-pointer" />
            </div>

            <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-800/30">
              <label className="flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-300 mb-3">
                <Download className="w-4 h-4" /> Support File (Cloudinary)
              </label>
              <input type="file" onChange={e => setSupportFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 transition-colors file:cursor-pointer cursor-pointer" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center shadow-md">
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> 
                  Processing Upload...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" /> Save Lesson to Curriculum
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Curriculum List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : modules.length > 0 ? (
          modules.map((moduleItem, mIdx) => {
            const moduleLessons = lessons.filter(l => l.module_id === moduleItem.id);
            return (
              <div key={moduleItem.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center group">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Mod {mIdx + 1}:</span> {moduleItem.title}
                  </h3>
                  <button onClick={() => handleDeleteModule(moduleItem.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded" title="Delete Module">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {moduleLessons.length > 0 ? moduleLessons.map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {lIdx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h4>
                          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            {lesson.content_text && <span className="flex items-center gap-1 text-gray-600"><FileText className="w-3 h-3" /> Text</span>}
                            {lesson.video_url && <span className="flex items-center gap-1 text-blue-600"><Video className="w-3 h-3" /> Video</span>}
                            {lesson.pdf_url && <span className="flex items-center gap-1 text-red-500"><FileText className="w-3 h-3" /> PDF</span>}
                            {lesson.support_file_url && <span className="flex items-center gap-1 text-green-600"><Download className="w-3 h-3" /> File</span>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )) : (
                    <div className="p-4 text-center text-gray-400 text-sm">No lessons in this module.</div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <FolderPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No curriculum modules created yet.</p>
            <button onClick={() => setShowModuleForm(true)} className="mt-4 text-blue-600 font-semibold text-sm">Create your first module</button>
          </div>
        )}
      </div>
    </div>
  );
}
