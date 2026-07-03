import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: courses } = await supabase.from('courses').select('id, title');
  console.log("Courses:", courses);
  
  const { error: err1 } = await supabase.from('modules').select('*').limit(1);
  console.log("Modules exists?", !err1, err1?.message);
  
  const { error: err2 } = await supabase.from('lessons_new').select('*').limit(1);
  console.log("Lessons_new exists?", !err2, err2?.message);
}
check();
