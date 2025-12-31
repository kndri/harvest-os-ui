# Backend: Prayer Wall

## Database Schema

```sql
CREATE TABLE prayer_requests (
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

CREATE TABLE prayer_prayed_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prayer_request_id, user_id)
);
```

## RPC Function

```sql
CREATE OR REPLACE FUNCTION increment_prayer_count(
  p_prayer_request_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1 FROM prayer_prayed_log
    WHERE prayer_request_id = p_prayer_request_id
    AND user_id = auth.uid()
  ) THEN
    RETURN (SELECT prayed_count FROM prayer_requests WHERE id = p_prayer_request_id);
  END IF;
  
  INSERT INTO prayer_prayed_log (prayer_request_id, user_id)
  VALUES (p_prayer_request_id, auth.uid())
  ON CONFLICT DO NOTHING;
  
  UPDATE prayer_requests
  SET prayed_count = prayed_count + 1
  WHERE id = p_prayer_request_id
  RETURNING prayed_count INTO v_count;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
