import { PlayCircle, FileText, Folder, BookOpen, MonitorPlay, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: popularCourses } = await supabase.from('courses').select('*').order('id', { ascending: true });

  const popularResources = [
    { id: 1, title: "Class 1 Notes", type: "pdf", icon: <FileText className="w-8 h-8 text-blue-500 mb-2" /> },
    { id: 2, title: "Source Code", type: "folder", icon: <Folder className="w-8 h-8 text-yellow-500 mb-2" /> },
    { id: 3, title: "Design Assets", type: "folder", icon: <Folder className="w-8 h-8 text-yellow-500 mb-2" /> },
    { id: 4, title: "Cheat Sheet", type: "pdf", icon: <FileText className="w-8 h-8 text-blue-500 mb-2" /> },
  ];

  const categories = ["All", "Web Development", "Cyber Security", "Graphic Design", "Digital Marketing", "App Development"];

  return (
    <div className="flex-1 w-full overflow-y-auto bg-gray-50/50 pb-20">
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Welcome back to your learning journey
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium mb-8 max-w-lg leading-relaxed">
              Continue where you left off or discover new courses to enhance your skills today.
            </p>
            <div className="flex gap-4">
              <Link href="#courses" className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3.5 px-6 rounded-full transition-colors shadow-lg flex items-center">
                Explore Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-12">
        
        {/* Categories Filter */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-3">
          <div className="flex overflow-x-auto gap-2 md:gap-3 snap-x pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  idx === 0 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Popular Courses */}
        <section id="courses">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Our Popular Courses</h2>
            <Link href="/courses" className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-5 pb-6 -mx-4 px-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:-mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {popularCourses?.map((course) => {
              // Mock progress between 0 and 100 for visual demo
              const mockProgress = Math.floor(Math.random() * 60) + 10; 
              
              return (
                <Link href={`/courses/${course.id}`} key={course.id} className="min-w-[280px] shrink-0 snap-start md:min-w-0 md:w-auto block bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col h-full">
                  
                  {/* Card Image */}
                  <div className="h-44 w-full overflow-hidden relative bg-gray-100">
                    {course.image_url ? (
                      <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MonitorPlay className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Floating Meta Tag */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-blue-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      Premium
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-2">{course.instructor_name}</p>
                    
                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-3">
                        <span className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 
                          {course.modules_count} Modules
                        </span>
                        <span className="flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <PlayCircle className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 
                          {course.duration}
                        </span>
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-blue-500" 
                          style={{ width: `${mockProgress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

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
