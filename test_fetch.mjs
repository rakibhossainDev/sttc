import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', 4);
    
  console.log("Modules error:", error);
  console.log(`Found ${modules?.length || 0} modules.`);
  
  if (modules?.length > 0) {
    const { data: lessons, error: lErr } = await supabase
      .from('lessons_new')
      .select('*')
      .in('module_id', modules.map(m => m.id));
      
    console.log("Lessons error:", lErr);
    console.log(`Found ${lessons?.length || 0} lessons.`);
  }
}
testFetch();
