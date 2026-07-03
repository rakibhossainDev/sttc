"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Loader2, BookOpen } from "lucide-react";
import CurriculumManager from "./CurriculumManager";

export default function CourseManager({ initialCourses, categories, adminName }: { initialCourses: any[], categories: any[], adminName: string }) {
  const [courses, setCourses] = useState(initialCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const supabase = createClient();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState("");
  const [modulesCount, setModulesCount] = useState("");

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = "";

      // Upload to Cloudinary if a file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorResponse = await uploadRes.json();
          console.error("Cloudinary Error Details:", errorResponse);
          throw new Error(errorResponse.error?.message || "Failed to upload image to Cloudinary.");
        }
        
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.secure_url;
      }

      const newCourse = {
        title,
        description,
        category_id: categoryId ? parseInt(categoryId) : null,
        image_url: uploadedImageUrl,
        duration,
        modules_count: parseInt(modulesCount) || 0,
        instructor_name: adminName // Defaulting to the logged in admin
      };

    const { data, error } = await supabase
      .from('courses')
      .insert([newCourse])
      .select()
      .single();

      if (error) {
        throw new Error(error.message);
      } else if (data) {
        setCourses([data, ...courses]);
        setShowForm(false);
        // Reset form
        setTitle("");
        setDescription("");
        setCategoryId("");
        setImageFile(null);
        setDuration("");
        setModulesCount("");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting course: " + error.message);
    } else {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  if (selectedCourse) {
    return <CurriculumManager courseId={selectedCourse.id} courseTitle={selectedCourse.title} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manage Courses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleAddCourse} className="mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Course Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
              <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white">
                <option value="">Select Category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" rows={2} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Course Thumbnail</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Duration (e.g. '3 Months')</label>
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Modules Count</label>
              <input type="number" value={modulesCount} onChange={e => setModulesCount(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> 
                Processing Upload...
              </>
            ) : "Save Course"}
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 gap-4">
            <div className="flex gap-4 items-center overflow-hidden">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-16 h-12 object-cover rounded-md flex-shrink-0" />
              ) : (
                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0" />
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {categories.find(c => c.id === course.category_id)?.name || 'No Category'} • {course.duration || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:self-auto flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setSelectedCourse(course)}
                className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2 text-sm font-semibold border border-blue-100 dark:border-blue-800 bg-white dark:bg-gray-800"
              >
                <BookOpen className="w-4 h-4" /> Manage Curriculum
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex justify-center items-center border border-transparent"
                title="Delete course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No courses available.</p>
        )}
      </div>
    </div>
  );
}
