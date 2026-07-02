import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  DownloadCloud, 
  ChevronRight, 
  Award, 
  Clock, 
  BookOpen, 
  Edit3
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const handleSignOut = async () => {
    "use server";
    const supabaseAction = await createClient();
    await supabaseAction.auth.signOut();
    redirect('/login');
  };

  const userName = user?.user_metadata?.full_name || "MD RAKIB HOSSAIN";
  const userEmail = user?.email || "student@sttc.edu";

  const { data: progressData } = await supabase
    .from('user_progress')
    .select('*, courses(*)')
    .eq('user_id', user?.id);

  const ongoingCourses = progressData?.map((item: any) => ({
    id: item.courses.id,
    title: item.courses.title,
    progress: item.progress_percentage,
    image: item.courses.image_url
  })) || [];

  const stats = [
    { label: "Classes Completed", value: ongoingCourses.length.toString(), icon: BookOpen },
    { label: "Watch Time", value: "24 hrs", icon: Clock },
    { label: "Certificates", value: "2", icon: Award },
  ];


  const menuItems = [
    { label: "Edit Profile", icon: Edit3, href: "#" },
    { label: "Notifications", icon: Bell, href: "#" },
    { label: "Downloaded Resources", icon: DownloadCloud, href: "#" },
    { label: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <div className="flex-1 w-full bg-gray-50 overflow-y-auto pb-10">
      
      {/* Cover Photo */}
      <div className="w-full h-32 md:h-52 bg-slate-800 relative">
        <img 
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80" 
          alt="Cover" 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Profile Identity - Photo on Right */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Student</p>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
              {userName}
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">{userEmail}</p>
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 border-4 border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden relative">
             <User className="w-8 h-8 text-blue-500 absolute" />
          </div>
        </div>

        <div className="mt-6 space-y-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Dashboard Stats Grid */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">My Dashboard</h2>
              <div className="grid grid-cols-3 gap-3 md:gap-5">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50/80 rounded-full flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* In Progress / My Courses */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">In Progress</h2>
              <div className="space-y-4">
                {ongoingCourses.map((course) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className="block bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center hover:shadow-md transition-shadow cursor-pointer group">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="ml-4 flex-1 pr-2">
                      <h3 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                      
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs text-gray-500 font-medium">{course.progress}% Completed</span>
                        <span className="text-xs font-bold text-blue-600 group-hover:underline">Continue</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            {/* Profile Menu */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-1 lg:hidden">Settings</h2>
              <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={idx}
                      href={item.href}
                      className="w-full flex items-center justify-between p-4.5 md:p-5 hover:bg-gray-50 transition-colors active:bg-gray-100 group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg transition-colors bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm transition-colors text-gray-700 group-hover:text-gray-900">
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-gray-400 group-hover:text-blue-500" />
                    </Link>
                  )
                })}
                <form action={handleSignOut}>
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-between p-4.5 md:p-5 hover:bg-gray-50 transition-colors active:bg-gray-100 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg transition-colors bg-red-50 text-red-500 group-hover:bg-red-100">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm transition-colors text-red-500 group-hover:text-red-600">
                        Logout
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-red-500 group-hover:text-red-600" />
                  </button>
                </form>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
