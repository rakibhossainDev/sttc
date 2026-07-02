import { Lock, PlayCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import VideoPlayerUI from '@/components/VideoPlayerUI';

export default async function VideoPlayer({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: currentLesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!currentLesson) {
    notFound();
  }

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', currentLesson.course_id)
    .single();

  const { data: playlist } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', currentLesson.course_id)
    .order('lesson_order', { ascending: true });

  const resources = playlist?.filter(l => l.pdf_url) || [];

  return (
    <div className="flex-1 w-full bg-gray-50 pb-20 lg:pb-0 overflow-y-auto">
      <div className="max-w-7xl mx-auto lg:p-8 lg:grid lg:grid-cols-3 lg:gap-10">
        
        <VideoPlayerUI currentLesson={currentLesson} course={course} otherResources={resources} />

        {/* Playlist Content (Right Column on Desktop) */}
        <div className="px-4 lg:px-0 lg:col-span-1 pb-10 lg:pb-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:sticky lg:top-24 lg:max-h-[calc(100vh-140px)]">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 text-lg">Course Content</h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">{playlist?.length || 0} Lessons</p>
            </div>
            
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {playlist?.map((item, index) => {
                const isPlaying = item.id.toString() === params.id;
                
                return (
                  <Link 
                    href={`/play/${item.id}`}
                    key={item.id} 
                    className={`flex items-start p-4 transition-colors group ${
                      isPlaying ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="mr-4 mt-0.5">
                      {isPlaying ? (
                        <div className="w-5 h-5 flex items-end justify-center space-x-[2px] pb-1">
                          <span className="w-1 h-2 bg-blue-600 rounded-sm animate-[bounce_1s_infinite] [animation-delay:-0.3s]" />
                          <span className="w-1 h-4 bg-blue-600 rounded-sm animate-[bounce_1s_infinite] [animation-delay:-0.15s]" />
                          <span className="w-1 h-3 bg-blue-600 rounded-sm animate-[bounce_1s_infinite]" />
                        </div>
                      ) : item.video_url ? (
                        <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold truncate ${isPlaying ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {index + 1}. {item.title}
                      </h4>
                      <p className={`text-xs mt-1 font-medium ${isPlaying ? 'text-blue-500' : 'text-gray-500'}`}>
                        {item.duration || (item.video_url ? 'Video' : 'PDF')}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
