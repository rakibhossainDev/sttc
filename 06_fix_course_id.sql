-- This script fixes the module assignment by moving all seeded CBT&A modules to Course ID 4
-- and deletes any redundant duplicate course that was automatically created by the previous script.

DO $$ 
DECLARE
  v_wrong_course_id BIGINT;
BEGIN
  -- 1. Find the course_id that the modules are currently assigned to (assuming it's not 4)
  SELECT course_id INTO v_wrong_course_id 
  FROM public.modules 
  WHERE title = 'Module 1: Receive and Respond to Workplace Communication' 
  LIMIT 1;

  IF v_wrong_course_id IS NOT NULL AND v_wrong_course_id != 4 THEN
    -- 2. Move all 11 modules to Course ID 4
    UPDATE public.modules 
    SET course_id = 4 
    WHERE course_id = v_wrong_course_id;
    
    -- 3. Delete the redundant course that the previous script created (e.g. Course 5)
    -- But only if its title is the CBT&A one, to be absolutely safe not to delete another course!
    DELETE FROM public.courses 
    WHERE id = v_wrong_course_id 
      AND title = 'Competency-Based Training & Assessment';
      
  END IF;
END $$;
