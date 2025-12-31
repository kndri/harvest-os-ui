-- Create Test Users and Assign Roles
-- NOTE: Users have already been created and roles assigned via scripts/create-and-assign-users.js
-- This SQL file is provided for reference or manual execution if needed.
--
-- Users created:
-- - admin@gracechurch.org / admin123 (ID: 653692a8-4d5a-4074-802f-2adabf333773)
-- - member@gracechurch.org / member123 (ID: 6f7bdcba-5cc6-48da-bb98-c64446dccd3a)
-- - moderator@gracechurch.org / moderator123 (ID: d886604d-34dc-43f4-898a-3723d499d7b6)
-- - finance@gracechurch.org / finance123 (ID: cfda5505-ecd9-4b91-afd0-d45c37322cb2)

BEGIN;

-- Grace Community Church Organization ID
-- This is the org_id from the demo seed migration
-- Organization: Grace Community Church (slug: grace-community)
-- ID: 11111111-1111-1111-1111-111111111111

-- Admin User
-- admin@gracechurch.org
INSERT INTO org_memberships (org_id, user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '653692a8-4d5a-4074-802f-2adabf333773', 'admin')
ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'admin';

-- Member User
-- member@gracechurch.org
INSERT INTO org_memberships (org_id, user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '6f7bdcba-5cc6-48da-bb98-c64446dccd3a', 'member')
ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'member';

-- Moderator User
-- moderator@gracechurch.org
INSERT INTO org_memberships (org_id, user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'd886604d-34dc-43f4-898a-3723d499d7b6', 'moderator')
ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'moderator';

-- Finance User
-- finance@gracechurch.org
INSERT INTO org_memberships (org_id, user_id, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'cfda5505-ecd9-4b91-afd0-d45c37322cb2', 'finance')
ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'finance';

COMMIT;

-- Alternative: Query to get user IDs if you know the emails
-- Run this first to get the user IDs, then use them in the INSERT statements above
--
-- SELECT id, email 
-- FROM auth.users 
-- WHERE email IN (
--   'admin@gracechurch.org',
--   'member@gracechurch.org',
--   'moderator@gracechurch.org',
--   'finance@gracechurch.org'
-- );
