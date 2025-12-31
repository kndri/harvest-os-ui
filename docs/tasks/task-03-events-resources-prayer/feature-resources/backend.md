# Backend: Resources

## Database Schema

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  category TEXT,
  language TEXT DEFAULT 'both' CHECK (language IN ('en', 'fr', 'both')),
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_resources_program_id ON resources(program_id);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_language ON resources(language);
```

## Storage Bucket

```sql
-- Create resources bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true);

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
```
