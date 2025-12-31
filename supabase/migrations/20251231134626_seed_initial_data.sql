-- Migration: Seed Initial Data
-- Description: Seeds initial test data for development

BEGIN;

-- Create test organization
INSERT INTO organizations (id, name, slug)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Test Church', 'test-church')
ON CONFLICT (id) DO NOTHING;

-- Note: Users and memberships should be created via Supabase Auth UI or API
-- To create a test user:
-- 1. Go to Supabase Dashboard → Authentication → Users → Add User
-- 2. Create user with email/password
-- 3. Then run this SQL in the SQL Editor to add them to the organization:
--    INSERT INTO org_memberships (org_id, user_id, role)
--    VALUES ('00000000-0000-0000-0000-000000000001', '<user-id>', 'admin')
--    ON CONFLICT DO NOTHING;

COMMIT;
