# Backend: Day Progress

## Database Schema

```sql
CREATE TABLE user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_day_id)
);

CREATE INDEX idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX idx_user_day_progress_program_day_id ON user_day_progress(program_day_id);
```

## RLS Policies

```sql
ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can manage own progress"
  ON user_day_progress FOR ALL
  USING (auth.uid() = user_id);
```

## RPC Functions

### Get User Progress for Program
```sql
CREATE OR REPLACE FUNCTION get_user_progress(
  p_user_id UUID,
  p_program_id UUID
)
RETURNS TABLE (
  total_days INTEGER,
  completed_days INTEGER,
  completion_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT pd.id)::INTEGER as total_days,
    COUNT(DISTINCT udp.id)::INTEGER as completed_days,
    ROUND(
      (COUNT(DISTINCT udp.id)::NUMERIC / NULLIF(COUNT(DISTINCT pd.id), 0)) * 100,
      2
    ) as completion_percentage
  FROM program_days pd
  LEFT JOIN user_day_progress udp ON udp.program_day_id = pd.id AND udp.user_id = p_user_id AND udp.completed_at IS NOT NULL
  WHERE pd.program_id = p_program_id
  GROUP BY pd.program_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration

```sql
-- Migration: 20250127120003_create_user_day_progress.sql

BEGIN;

CREATE TABLE IF NOT EXISTS user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_day_id)
);

CREATE INDEX IF NOT EXISTS idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_program_day_id ON user_day_progress(program_day_id);

ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON user_day_progress FOR ALL
  USING (auth.uid() = user_id);

COMMIT;
```
