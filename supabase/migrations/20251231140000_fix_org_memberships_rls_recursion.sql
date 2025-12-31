-- Migration: Fix org_memberships RLS Recursion
-- Description: Fixes infinite recursion in org_memberships RLS policy that prevents programs from being queried
-- The issue: The "Admins can manage memberships" policy queries org_memberships, causing recursion
-- Solution: Use SECURITY DEFINER function that bypasses RLS

BEGIN;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage memberships in their org" ON org_memberships;

-- Create a helper function that bypasses RLS for checking admin status
-- SECURITY DEFINER runs with the privileges of the function creator (postgres)
-- This bypasses RLS, preventing recursion
CREATE OR REPLACE FUNCTION is_org_admin(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- This query bypasses RLS because function is SECURITY DEFINER
  RETURN EXISTS (
    SELECT 1 FROM public.org_memberships
    WHERE org_id = p_org_id
    AND user_id = p_user_id
    AND role = 'admin'
  );
END;
$$;

-- Now create the policy using the function
CREATE POLICY "Admins can manage memberships in their org"
  ON org_memberships FOR ALL
  USING (is_org_admin(org_id, auth.uid()))
  WITH CHECK (is_org_admin(org_id, auth.uid()));

COMMIT;
