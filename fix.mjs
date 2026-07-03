import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  // Find all courses
  const { data: courses, error } = await supabase.from('courses').select('*');
  console.log("Existing Courses:");
  courses?.forEach(c => console.log(`ID: ${c.id}, Title: ${c.title}`));

  // Check what modules exist
  const { data: modules } = await supabase.from('modules').select('id, course_id, title');
  console.log(`\nFound ${modules?.length} modules.`);
  
  if (modules && modules.length > 0) {
    const wrongCourseId = modules[0].course_id;
    console.log(`Modules are currently assigned to course_id: ${wrongCourseId}`);
    
    if (wrongCourseId !== 4) {
      console.log("Updating modules to course_id = 4...");
      const { error: updateErr } = await supabase.from('modules').update({ course_id: 4 }).neq('id', 0); // update all
      if (updateErr) {
        console.error("Failed to update modules:", updateErr);
      } else {
        console.log("Successfully moved modules to course_id = 4.");
        // Delete the redundant course if it was auto-created by the script and is not 4
        await supabase.from('courses').delete().eq('id', wrongCourseId);
        console.log(`Deleted redundant auto-created course ${wrongCourseId}.`);
      }
    }
  }
}
fix();
