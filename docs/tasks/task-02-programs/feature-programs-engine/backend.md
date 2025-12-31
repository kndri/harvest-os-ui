# Backend: Programs Engine

## Database Schema

### programs Table
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  is_dated BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, slug)
);

CREATE INDEX idx_programs_org_id ON programs(org_id);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_slug ON programs(slug);
```

### Config JSONB Structure
```json
{
  "resources": true,
  "prayer_wall": true,
  "events": true,
  "speakers": true
}
```

### Branding JSONB Structure
```json
{
  "primary_color": "#FF5733",
  "secondary_color": "#33FF57",
  "banner_url": "https://...",
  "logo_url": "https://..."
}
```

## RLS Policies

```sql
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Public can read published programs
CREATE POLICY "Programs are viewable by everyone if published"
  ON programs FOR SELECT
  USING (status = 'published');

-- Org members can read all programs in their org
CREATE POLICY "Org members can view all programs in their org"
  ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Admins can manage programs in their org
CREATE POLICY "Admins can manage programs in their org"
  ON programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );
```

## RPC Functions

### Get Program with Today's Day
```sql
CREATE OR REPLACE FUNCTION get_program_with_today(
  p_program_slug TEXT,
  p_org_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS JSON AS $$
DECLARE
  v_program JSON;
  v_today_day JSON;
BEGIN
  SELECT json_build_object(
    'id', id,
    'slug', slug,
    'title', CASE WHEN p_locale = 'fr' THEN title_fr ELSE title_en END,
    'description', CASE WHEN p_locale = 'fr' THEN description_fr ELSE description_en END,
    'config', config,
    'branding', branding,
    'start_date', start_date,
    'end_date', end_date,
    'duration_days', duration_days,
    'is_dated', is_dated
  ) INTO v_program
  FROM programs
  WHERE slug = p_program_slug AND org_id = p_org_id;
  
  IF v_program->>'start_date' IS NOT NULL THEN
    SELECT json_build_object(
      'day_index', day_index,
      'title', CASE WHEN p_locale = 'fr' THEN title_fr ELSE title_en END
    ) INTO v_today_day
    FROM program_days
    WHERE program_id = (v_program->>'id')::UUID
    AND day_index = (
      SELECT EXTRACT(DAY FROM CURRENT_DATE - (v_program->>'start_date')::DATE)::INTEGER + 1
    );
  END IF;
  
  RETURN json_build_object(
    'program', v_program,
    'today_day', v_today_day
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration

```sql
-- Migration: 20250127120001_create_programs_table.sql

BEGIN;

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  is_dated BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  branding JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_programs_org_id ON programs(org_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- RLS policies (see above)

COMMIT;
```
