-- Migration: Create Program Days Table
-- Description: Stores daily content for each program

BEGIN;

CREATE TABLE IF NOT EXISTS program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL,
  title_en TEXT,
  title_fr TEXT,
  devotional_en TEXT,
  devotional_fr TEXT,
  scriptures_en TEXT[],
  scriptures_fr TEXT[],
  prayer_focus_en TEXT,
  prayer_focus_fr TEXT,
  fasting_focus_en TEXT,
  fasting_focus_fr TEXT,
  activities_en TEXT,
  activities_fr TEXT,
  reflection_questions_en TEXT[],
  reflection_questions_fr TEXT[],
  family_guide_en TEXT,
  family_guide_fr TEXT,
  media_urls TEXT[],
  notes_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, day_index)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_program_days_program_id ON program_days(program_id);
CREATE INDEX IF NOT EXISTS idx_program_days_day_index ON program_days(day_index);

-- Enable RLS
ALTER TABLE program_days ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Program days inherit program access" ON program_days;
DROP POLICY IF EXISTS "Admins can manage program days" ON program_days;

-- Inherit access from parent program (published programs or org members)
CREATE POLICY "Program days inherit program access"
  ON program_days FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_days.program_id
      AND (
        programs.status = 'published'
        OR EXISTS (
          SELECT 1 FROM org_memberships
          WHERE org_memberships.org_id = programs.org_id
          AND org_memberships.user_id = auth.uid()
        )
      )
    )
  );

-- Admins can manage program days
CREATE POLICY "Admins can manage program days"
  ON program_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM programs
      JOIN org_memberships ON org_memberships.org_id = programs.org_id
      WHERE programs.id = program_days.program_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

COMMIT;
