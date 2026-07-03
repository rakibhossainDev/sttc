import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CourseViewer from "./CourseViewer";

export const revalidate = 0;

export default async function CoursePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const courseId = parseInt(params.id);

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

  // Fetch all lessons for this course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('lesson_order', { ascending: true })
    .order('id', { ascending: true });

  return (
    <main className="w-full">
      <CourseViewer course={course} lessons={lessons || []} />
    </main>
  );
}
