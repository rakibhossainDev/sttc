-- Run this script in your Supabase SQL Editor to prepare the database for the dynamic curriculum features

-- 1. Add support_file_url to lessons
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS support_file_url TEXT;

-- 2. Ensure Admin write policies on lessons
DROP POLICY IF EXISTS "Allow admin write access to lessons" ON public.lessons;
CREATE POLICY "Allow admin write access to lessons" ON public.lessons 
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );
