-- Migration: Create Prayer RPC Function
-- Description: Creates RPC function for incrementing prayer count

BEGIN;

-- Drop function if exists (for idempotency)
DROP FUNCTION IF EXISTS increment_prayer_count(UUID);

-- Create RPC function for incrementing prayer count
CREATE OR REPLACE FUNCTION increment_prayer_count(
  p_prayer_request_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Check if user already prayed for this request
  IF EXISTS (
    SELECT 1 FROM prayer_prayed_log
    WHERE prayer_request_id = p_prayer_request_id
    AND user_id = auth.uid()
  ) THEN
    -- Return current count without incrementing
    RETURN (SELECT prayed_count FROM prayer_requests WHERE id = p_prayer_request_id);
  END IF;
  
  -- Insert prayer log entry
  INSERT INTO prayer_prayed_log (prayer_request_id, user_id)
  VALUES (p_prayer_request_id, auth.uid())
  ON CONFLICT DO NOTHING;
  
  -- Update prayer count
  UPDATE prayer_requests
  SET prayed_count = prayed_count + 1
  WHERE id = p_prayer_request_id
  RETURNING prayed_count INTO v_count;
  
  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
