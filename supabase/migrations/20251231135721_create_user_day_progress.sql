-- Migration: Create User Day Progress Table
-- Description: Tracks user completion and notes for each program day

BEGIN;

CREATE TABLE IF NOT EXISTS user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_day_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_program_day_id ON user_day_progress(program_day_id);

-- Enable RLS
ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can manage own progress" ON user_day_progress;

-- Users can only access their own progress
CREATE POLICY "Users can manage own progress"
  ON user_day_progress FOR ALL
  USING (auth.uid() = user_id);

COMMIT;
