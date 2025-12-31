# Backend: i18n Setup

## Database Schema

All user-facing content tables should have `_en` and `_fr` columns:

```sql
-- Example: programs table
CREATE TABLE programs (
  ...
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  ...
);
```

## RPC Functions

### Get Localized Content
```sql
CREATE OR REPLACE FUNCTION get_localized_text(
  p_en TEXT,
  p_fr TEXT,
  p_locale TEXT DEFAULT 'en'
)
RETURNS TEXT AS $$
BEGIN
  IF p_locale = 'fr' AND p_fr IS NOT NULL AND p_fr != '' THEN
    RETURN p_fr;
  END IF;
  RETURN COALESCE(p_en, '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## Migration

No specific migration needed - i18n is handled at the application level with column naming convention.
