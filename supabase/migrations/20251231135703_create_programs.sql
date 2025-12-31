-- Migration: Create Programs Table
-- Description: Core programs table for church programs/initiatives

BEGIN;

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  is_dated BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{"resources": true, "prayer_wall": true, "events": true, "speakers": true}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, slug)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_programs_org_id ON programs(org_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Programs are viewable by everyone if published" ON programs;
DROP POLICY IF EXISTS "Org members can view all programs in their org" ON programs;
DROP POLICY IF EXISTS "Admins can manage programs in their org" ON programs;

-- Public can read published programs
CREATE POLICY "Programs are viewable by everyone if published"
  ON programs FOR SELECT
  USING (status = 'published');

-- Org members can read all programs in their org
CREATE POLICY "Org members can view all programs in their org"
  ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Admins can manage programs in their org
CREATE POLICY "Admins can manage programs in their org"
  ON programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

COMMIT;
