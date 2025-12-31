-- Migration: Create Prayer Wall Tables
-- Description: Creates prayer_requests and prayer_prayed_log tables

BEGIN;

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  prayed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

-- Create prayer_prayed_log table
CREATE TABLE IF NOT EXISTS prayer_prayed_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prayer_request_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_program_id ON prayer_requests(program_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_id ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_approved ON prayer_requests(is_approved);
CREATE INDEX IF NOT EXISTS idx_prayer_prayed_log_prayer_request_id ON prayer_prayed_log(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_prayed_log_user_id ON prayer_prayed_log(user_id);

-- Enable RLS
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_prayed_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Public can view approved prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can create prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can view own prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Moderators can moderate prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Users can log prayers" ON prayer_prayed_log;

-- Prayer requests: Public can view approved
CREATE POLICY "Public can view approved prayer requests"
  ON prayer_requests FOR SELECT
  USING (is_approved = true);

-- Prayer requests: Users can create
CREATE POLICY "Users can create prayer requests"
  ON prayer_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Prayer requests: Users can view own (even if not approved)
CREATE POLICY "Users can view own prayer requests"
  ON prayer_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Prayer requests: Moderators and admins can moderate
CREATE POLICY "Moderators can moderate prayer requests"
  ON prayer_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM programs
      JOIN org_memberships ON org_memberships.org_id = programs.org_id
      WHERE programs.id = prayer_requests.program_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin', 'moderator')
    )
  );

-- Prayer prayed log: Users can insert their own prayers
CREATE POLICY "Users can log prayers"
  ON prayer_prayed_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Prayer prayed log: Users can view their own prayer logs
CREATE POLICY "Users can view own prayer logs"
  ON prayer_prayed_log FOR SELECT
  USING (auth.uid() = user_id);

COMMIT;
