-- Add missing columns for video support
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS has_video boolean DEFAULT false;

-- Modify author_id to link to team_members instead of profiles (which requires auth users)
-- This allows us to restore the mock authors without creating auth accounts for them
ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

-- Make author_id nullable to avoid issues during transition
ALTER TABLE public.articles ALTER COLUMN author_id DROP NOT NULL;

-- Link to team_members
ALTER TABLE public.articles 
  ADD CONSTRAINT articles_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES public.team_members(id);

-- Update the article fetch query will need to change in the codebase to select 'name' instead of 'full_name'
