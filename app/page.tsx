import { PlayCircle, FileText, Folder, BookOpen, MonitorPlay, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/HeroSlider";
import HomeCourseList from "@/components/HomeCourseList";

export default async function Home() {
  const supabase = await createClient();
  const [
    { data: popularCourses },
    { data: dbCategories },
    { data: dbSlides }
  ] = await Promise.all([
    supabase.from('courses').select('*').order('id', { ascending: true }),
    supabase.from('categories').select('*').order('id', { ascending: true }),
    supabase.from('hero_slides').select('*').eq('is_active', true).order('id', { ascending: true })
  ]);

  const popularResources = [
    { id: 1, title: "Class 1 Notes", type: "pdf", icon: <FileText className="w-8 h-8 text-blue-500 mb-2" /> },
    { id: 2, title: "Source Code", type: "folder", icon: <Folder className="w-8 h-8 text-yellow-500 mb-2" /> },
    { id: 3, title: "Design Assets", type: "folder", icon: <Folder className="w-8 h-8 text-yellow-500 mb-2" /> },
    { id: 4, title: "Cheat Sheet", type: "pdf", icon: <FileText className="w-8 h-8 text-blue-500 mb-2" /> },
  ];

  const categories = ["All", ...(dbCategories?.filter(c => c.name !== 'All').map(c => c.name) || [])];
  const slides = dbSlides?.map(s => s.image_url) || [];

  return (
    <div className="flex-1 w-full overflow-y-auto bg-gray-50/50 pb-20">
      {/* Hero Section */}
      <section className="w-full mb-4 md:mb-8 px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-4 max-w-7xl mx-auto">
        <HeroSlider slides={slides} />
      </section>


      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-12">
        
        <HomeCourseList popularCourses={popularCourses || []} categories={categories} />

        {/* Popular Resources */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Popular Resources</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-6 md:overflow-visible md:-mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {popularResources.map((resource) => (
              <div key={resource.id} className="flex-shrink-0 snap-start w-32 md:w-auto bg-white p-5 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-300 mb-3">
                  {resource.icon}
                </div>
                <span className="text-sm font-bold text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
