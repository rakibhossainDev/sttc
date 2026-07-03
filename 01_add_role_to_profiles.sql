-- Migration to add 'role' column to profiles
-- Run this in your Supabase SQL Editor

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;

-- Example to promote a user to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@sttc.edu';
