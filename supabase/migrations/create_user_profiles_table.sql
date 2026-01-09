-- User Profiles Table
-- Stores complete user profile information

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Personal Info
  full_legal_name TEXT,
  date_of_birth DATE,
  place_of_birth TEXT,
  phone_number TEXT,
  cnic TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  nationality TEXT,

  -- Contact Information
  physical_address TEXT,
  contact_info TEXT,

  -- Family Details
  father_name TEXT,
  father_dob DATE,
  mother_name TEXT,
  mother_dob DATE,
  spouse_name TEXT,
  spouse_dob DATE,
  siblings_count INTEGER,
  children_count INTEGER,

  -- Immigration Info
  visa_status TEXT,
  petitioner_name TEXT,
  case_number TEXT,
  travel_history TEXT,

  -- Education
  education_level TEXT,
  schools_attended TEXT,

  -- Employment
  current_employer TEXT,
  employer_address TEXT,
  position TEXT,
  start_date DATE,
  previous_employers TEXT,
  employment_gaps TEXT,

  -- Financial
  annual_income TEXT,
  sponsor_details TEXT,
  bank_statement TEXT,

  -- Travel & Residence
  residence_history TEXT,
  countries_visited TEXT,
  long_term_stays TEXT,

  -- Metadata
  profile_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_completed ON user_profiles(profile_completed);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
