-- Create ENUM for Question keys
DROP TYPE IF EXISTS question_key CASCADE;
CREATE TYPE question_key AS ENUM (
  'beneficiary_country',
  'marriage_date',
  'marriage_location',
  'previous_marriages',
  'how_did_you_meet',
  'first_in_person_meeting',
  'number_of_in_person_visits',
  'proposal_details',
  'courtship_duration',
  'current_living_arrangement',
  'spouse_address',
  'daily_communication',
  'shared_activities',
  'important_dates_knowledge',
  'met_spouse_family',
  'family_reaction_to_marriage',
  'wedding_attendees',
  'marriage_type',
  'mutual_friends',
  'beneficiary_employment',
  'sponsor_employment',
  'military_or_defense_background',
  'previous_us_visits',
  'previous_visa_refusal',
  'english_proficiency',
  'intended_us_state',
  'living_arrangements_in_us',
  'future_plans',
  'joint_finances',
  'financial_arrangement_description'
);

-- Main interview prep answers table
CREATE TABLE interview_prep_answers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Session Id
  session_id UUID NOT NULL REFERENCES interview_prep_sessions(id) ON DELETE CASCADE,

  -- Q/A
  question_key question_key NOT NULL,
  answer_value JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,   
);

-- Indexes
CREATE INDEX idx_interview_prep_answers_session_id ON interview_prep_answers(session_id);
CREATE UNIQUE INDEX uq_session_question ON interview_prep_answers(session_id, question_key);

-- Comments
COMMENT ON COLUMN interview_prep_answers.answer_value IS 'Stores the user answer in JSONB format to allow flexibility for different question types';