import { Star, User, Award, BarChart } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CourseCurriculum from '@/components/CourseCurriculum';

export default async function CourseDetails({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!course) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', params.id)
    .order('lesson_order', { ascending: true });

  const modulesMap = new Map();
  lessons?.forEach((lesson) => {
    const modTitle = lesson.module_title || 'General';
    if (!modulesMap.has(modTitle)) {
      modulesMap.set(modTitle, { title: modTitle, lessons: [] });
    }
    modulesMap.get(modTitle).lessons.push(lesson);
  });
  const modules = Array.from(modulesMap.values());

  const firstLessonId = lessons && lessons.length > 0 ? lessons[0].id : null;

  return (
    <div className="flex-1 w-full bg-gray-50 overflow-y-auto max-w-lg mx-auto">
      {/* Top Section */}
      <div className="bg-white pb-6 shadow-sm border-b border-gray-100">
        <div className="w-full aspect-video relative">
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        </div>
        
        <div className="px-5 mt-5 space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="flex items-center text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
              <BarChart className="w-3 h-3 mr-1" /> Beginner
            </span>
            <span className="flex items-center text-[10px] font-bold tracking-wider uppercase text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              <Award className="w-3 h-3 mr-1" /> Certificate Included
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{course.title}</h1>
          {course.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{course.instructor_name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-current" /> 4.8 Rating
                </div>
              </div>
            </div>
          </div>
          
          {firstLessonId ? (
            <Link href={`/play/${firstLessonId}`} className="block w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-center font-bold py-3.5 px-4 rounded-full shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
              Start Learning
            </Link>
          ) : (
            <button disabled className="w-full mt-6 bg-gray-300 text-gray-500 font-bold py-3.5 px-4 rounded-full cursor-not-allowed">
              No Lessons Available
            </button>
          )}
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="p-5 space-y-5">
        <h2 className="text-xl font-bold text-gray-800">Curriculum</h2>
        <CourseCurriculum modules={modules} />
      </div>
    </div>
  );
}
