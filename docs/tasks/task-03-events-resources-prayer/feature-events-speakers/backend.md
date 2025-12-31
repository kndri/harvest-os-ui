# Backend: Events & Speakers

## Database Schema

### speakers Table
```sql
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio_en TEXT,
  bio_fr TEXT,
  photo_url TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_speakers_org_id ON speakers(org_id);
```

### program_events Table
```sql
CREATE TABLE program_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
  location TEXT,
  livestream_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_program_events_program_id ON program_events(program_id);
CREATE INDEX idx_program_events_starts_at ON program_events(starts_at);
```

## RLS Policies

```sql
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_events ENABLE ROW LEVEL SECURITY;

-- Speakers: Org members can view
CREATE POLICY "Org members can view speakers"
  ON speakers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = speakers.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Events: Inherit from program access
CREATE POLICY "Events inherit program access"
  ON program_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_events.program_id
      AND (
        programs.status = 'published'
        OR EXISTS (
          SELECT 1 FROM org_memberships
          WHERE org_memberships.org_id = programs.org_id
          AND org_memberships.user_id = auth.uid()
        )
      )
    )
  );
```

## Migration

```sql
-- Migration: 20250127120004_create_events_speakers.sql

BEGIN;

CREATE TABLE IF NOT EXISTS speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio_en TEXT,
  bio_fr TEXT,
  photo_url TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  speaker_id UUID REFERENCES speakers(id) ON DELETE SET NULL,
  location TEXT,
  livestream_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_speakers_org_id ON speakers(org_id);
CREATE INDEX IF NOT EXISTS idx_program_events_program_id ON program_events(program_id);
CREATE INDEX IF NOT EXISTS idx_program_events_starts_at ON program_events(starts_at);

ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_events ENABLE ROW LEVEL SECURITY;

-- RLS policies (see above)

COMMIT;
```
