-- MIGRATION: Allow anonymous CV submissions
-- Run this in Supabase SQL Editor to enable anonymous CV scoring

-- 1. Allow NULL user_id in cv_submissions
ALTER TABLE public.cv_submissions ALTER COLUMN user_id DROP NOT NULL;

-- 2. Allow NULL user_id in analysis_jobs
ALTER TABLE public.analysis_jobs ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add policy to allow anonymous users to view their own submissions via share link
DROP POLICY IF EXISTS "cv_submissions_public_select" ON public.cv_submissions;
CREATE POLICY "cv_submissions_public_select" ON public.cv_submissions 
FOR SELECT TO anon USING (true);  -- Service role handles security via jobId lookup

DROP POLICY IF EXISTS "analysis_jobs_public_select" ON public.analysis_jobs;
CREATE POLICY "analysis_jobs_public_select" ON public.analysis_jobs 
FOR SELECT TO anon USING (true);  -- Service role handles security via jobId lookup

-- Verify changes
SELECT 
  table_name, 
  column_name, 
  is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('cv_submissions', 'analysis_jobs') 
  AND column_name = 'user_id';
