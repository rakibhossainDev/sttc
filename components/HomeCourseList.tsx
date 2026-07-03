"use client";

import { useState } from "react";
import Link from "next/link";
import { MonitorPlay, BookOpen, PlayCircle } from "lucide-react";

export default function HomeCourseList({ popularCourses, categories }: { popularCourses: any[], categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = selectedCategory === "All"
    ? popularCourses
    : popularCourses?.filter(course => {
        const keyword = selectedCategory.toLowerCase().split(' ')[0]; // E.g., 'Web', 'Cyber', 'Graphic'
        return course.title.toLowerCase().includes(keyword) || (course.description && course.description.toLowerCase().includes(keyword));
      });

  return (
    <>
      {/* Categories Filter */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-3 mb-8">
        <div className="flex overflow-x-auto gap-2 md:gap-3 snap-x pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
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
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
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
            })
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 font-medium">
              No courses found for this category.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
