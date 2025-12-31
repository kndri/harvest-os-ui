-- Migration: Create Resources Storage Bucket
-- Description: Creates storage bucket and policies for resources

BEGIN;

-- Create resources bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Resources are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload resources" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update resources" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resources" ON storage.objects;

-- Storage policy: Public read
CREATE POLICY "Resources are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

-- Storage policy: Admin write
CREATE POLICY "Admins can upload resources"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resources' AND
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

-- Storage policy: Admin update
CREATE POLICY "Admins can update resources"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resources' AND
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

-- Storage policy: Admin delete
CREATE POLICY "Admins can delete resources"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resources' AND
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

COMMIT;
