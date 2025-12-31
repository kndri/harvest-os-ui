-- Migration: Create Org Memberships Table
-- Description: Creates the org_memberships table for organization-based access control

BEGIN;

CREATE TABLE IF NOT EXISTS org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'admin', 'moderator', 'finance', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_memberships_user_id ON org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_id ON org_memberships(org_id);

-- Enable RLS
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own memberships" ON org_memberships;
DROP POLICY IF EXISTS "Admins can manage memberships in their org" ON org_memberships;

-- Create RLS policies
CREATE POLICY "Users can view own memberships"
  ON org_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage memberships in their org"
  ON org_memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = org_memberships.org_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
    )
  );

COMMIT;
