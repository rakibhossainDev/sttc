import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CourseViewer from "./CourseViewer";

export const revalidate = 0;

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const courseId = parseInt(id);

  if (isNaN(courseId)) {
    notFound();
  }

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch all modules for this course
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
    .order('id', { ascending: true });

  // Fetch all lessons for these modules
  let lessons: any[] = [];
  if (modules && modules.length > 0) {
    const moduleIds = modules.map(m => m.id);
    const { data: lessonsData } = await supabase
      .from('lessons_new')
      .select('*')
      .in('module_id', moduleIds)
      .order('order_index', { ascending: true })
      .order('id', { ascending: true });
    
    if (lessonsData) {
      lessons = lessonsData;
    }
  }

  return (
    <main className="w-full">
      <CourseViewer course={course} modules={modules || []} lessons={lessons} />
    </main>
  );
}
