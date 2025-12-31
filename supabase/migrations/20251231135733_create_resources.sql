-- Migration: Create Resources Table
-- Description: Creates resources table for program resources

BEGIN;

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  category TEXT,
  language TEXT DEFAULT 'both' CHECK (language IN ('en', 'fr', 'both')),
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resources_program_id ON resources(program_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_language ON resources(language);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Resources inherit program access" ON resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON resources;

-- Resources: Inherit from program access
CREATE POLICY "Resources inherit program access"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = resources.program_id
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

-- Resources: Admins can manage
CREATE POLICY "Admins can manage resources"
  ON resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM programs
      JOIN org_memberships ON org_memberships.org_id = programs.org_id
      WHERE programs.id = resources.program_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

COMMIT;
