-- Migration: Create Program RPC Functions
-- Description: Utility functions for programs and progress tracking

BEGIN;

-- Get program with today's day (for dated programs)
CREATE OR REPLACE FUNCTION get_program_with_today(
  p_program_slug TEXT,
  p_org_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS JSON AS $$
DECLARE
  v_program JSON;
  v_today_day JSON;
  v_program_id UUID;
  v_start_date DATE;
BEGIN
  -- Get the program
  SELECT 
    id,
    start_date,
    json_build_object(
      'id', id,
      'slug', slug,
      'title', CASE WHEN p_locale = 'fr' AND title_fr IS NOT NULL THEN title_fr ELSE title_en END,
      'description', CASE WHEN p_locale = 'fr' AND description_fr IS NOT NULL THEN description_fr ELSE description_en END,
      'config', config,
      'branding', branding,
      'start_date', start_date,
      'end_date', end_date,
      'duration_days', duration_days,
      'is_dated', is_dated,
      'status', status
    )
  INTO v_program_id, v_start_date, v_program
  FROM programs
  WHERE slug = p_program_slug 
  AND org_id = p_org_id
  AND (status = 'published' OR EXISTS (
    SELECT 1 FROM org_memberships 
    WHERE org_memberships.org_id = p_org_id 
    AND org_memberships.user_id = auth.uid()
  ));
  
  -- If program is dated, get today's day
  IF v_start_date IS NOT NULL AND v_program_id IS NOT NULL THEN
    SELECT json_build_object(
      'id', id,
      'day_index', day_index,
      'title', CASE WHEN p_locale = 'fr' AND title_fr IS NOT NULL THEN title_fr ELSE title_en END
    ) INTO v_today_day
    FROM program_days
    WHERE program_id = v_program_id
    AND day_index = (CURRENT_DATE - v_start_date)::INTEGER + 1;
  END IF;
  
  RETURN json_build_object(
    'program', v_program,
    'today_day', v_today_day
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user progress for a program
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
    COUNT(DISTINCT CASE WHEN udp.completed_at IS NOT NULL THEN udp.id END)::INTEGER as completed_days,
    ROUND(
      (COUNT(DISTINCT CASE WHEN udp.completed_at IS NOT NULL THEN udp.id END)::NUMERIC / NULLIF(COUNT(DISTINCT pd.id), 0)) * 100,
      2
    ) as completion_percentage
  FROM program_days pd
  LEFT JOIN user_day_progress udp ON udp.program_day_id = pd.id AND udp.user_id = p_user_id
  WHERE pd.program_id = p_program_id
  GROUP BY pd.program_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark day as complete
CREATE OR REPLACE FUNCTION mark_day_complete(
  p_program_day_id UUID
)
RETURNS user_day_progress AS $$
DECLARE
  v_result user_day_progress;
BEGIN
  INSERT INTO user_day_progress (user_id, program_day_id, completed_at)
  VALUES (auth.uid(), p_program_day_id, NOW())
  ON CONFLICT (user_id, program_day_id) 
  DO UPDATE SET completed_at = NOW(), updated_at = NOW()
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Save day notes
CREATE OR REPLACE FUNCTION save_day_notes(
  p_program_day_id UUID,
  p_notes TEXT
)
RETURNS user_day_progress AS $$
DECLARE
  v_result user_day_progress;
BEGIN
  INSERT INTO user_day_progress (user_id, program_day_id, notes)
  VALUES (auth.uid(), p_program_day_id, p_notes)
  ON CONFLICT (user_id, program_day_id) 
  DO UPDATE SET notes = p_notes, updated_at = NOW()
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
