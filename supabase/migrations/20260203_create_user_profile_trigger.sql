-- Run this migration to create user_profiles row automatically when user signs up
-- Copy and paste this SQL in Supabase SQL Editor

\echo 'Creating trigger to auto-create user_profiles on signup...'

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles table with default values
  INSERT INTO public.user_profiles (id, subscription_tier, subscription_status, created_at, updated_at)
  VALUES (
    NEW.id,
    'core',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Create trigger that fires after user signup
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_profile() TO service_role;

\echo 'Trigger created successfully!'

-- Now create rows for existing users who don't have user_profiles
\echo 'Creating user_profiles for existing users...'

INSERT INTO public.user_profiles (id, subscription_tier, subscription_status, created_at, updated_at)
SELECT 
  au.id,
  'core',
  'active',
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

\echo 'Migration complete! All existing users now have user_profiles rows.'
