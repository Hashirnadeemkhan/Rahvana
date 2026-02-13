-- Add profile_details column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS profile_details JSONB DEFAULT '{}'::jsonb;
