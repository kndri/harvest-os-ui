# Backend: Authentication & Role-Based Access Control

## Database Schema

### Tables

**profiles** (extends Supabase Auth)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**org_memberships**
```sql
CREATE TABLE org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'admin', 'moderator', 'finance', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE INDEX idx_org_memberships_user_id ON org_memberships(user_id);
CREATE INDEX idx_org_memberships_org_id ON org_memberships(org_id);
```

## Row-Level Security Policies

### Profiles
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Org Memberships
```sql
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships"
  ON org_memberships FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can manage memberships in their org
CREATE POLICY "Admins can manage memberships"
  ON org_memberships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships om
      WHERE om.org_id = org_memberships.org_id
      AND om.user_id = auth.uid()
      AND om.role = 'admin'
    )
  );
```

## Helper Functions

### Get User Role in Organization
```sql
CREATE OR REPLACE FUNCTION get_user_role(
  p_user_id UUID,
  p_org_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM org_memberships
  WHERE user_id = p_user_id
  AND org_id = p_org_id;
  
  RETURN COALESCE(v_role, 'member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Check User Permission
```sql
CREATE OR REPLACE FUNCTION check_user_permission(
  p_user_id UUID,
  p_org_id UUID,
  p_required_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role TEXT;
  v_role_hierarchy JSONB := '{"admin": 5, "finance": 4, "moderator": 3, "viewer": 2, "member": 1}'::jsonb;
  v_required_level INTEGER;
  v_user_level INTEGER;
BEGIN
  v_user_role := get_user_role(p_user_id, p_org_id);
  v_required_level := (v_role_hierarchy->>p_required_role)::INTEGER;
  v_user_level := (v_role_hierarchy->>v_user_role)::INTEGER;
  
  RETURN v_user_level >= v_required_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Client Helpers

### Server-Side Client (lib/supabase/server.ts)
```typescript
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side operations.
 * Uses the publishable key - respects RLS policies.
 */
export function createServerClient() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        getSession: async () => {
          const accessToken = cookieStore.get('sb-access-token')?.value;
          const refreshToken = cookieStore.get('sb-refresh-token')?.value;
          
          if (!accessToken) return { data: { session: null }, error: null };
          
          return { 
            data: { 
              session: { 
                access_token: accessToken, 
                refresh_token: refreshToken 
              } 
            }, 
            error: null 
          };
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getUserRole(orgId: string) {
  const { user } = await getCurrentUser();
  if (!user) return null;
  
  const supabase = createServerClient();
  const { data } = await supabase
    .from('org_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('org_id', orgId)
    .single();
  
  return data?.role || 'member';
}
```

### Client-Side Client (lib/supabase/client.ts)
```typescript
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser/client-side operations.
 * Uses the publishable key which is safe to expose in the browser.
 * All queries respect Row Level Security (RLS) policies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...  # Safe for client-side
SUPABASE_SECRET_KEY=sb_secret_...  # Server-side only, never expose!
```

**Key Differences:**
- **Publishable Key** (`sb_publishable_...`): Safe to expose, respects RLS, use in all client-side code
- **Secret Key** (`sb_secret_...`): Server-side only, bypasses RLS, never expose in browser

**Service Client (for admin operations that need to bypass RLS):**
```typescript
/**
 * Creates a Supabase client with service role privileges.
 * ⚠️ WARNING: This bypasses RLS - use only for admin operations.
 * Never expose this client to the browser or client-side code.
 */
export function createServiceClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Service client cannot be used in browser');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

Reference: [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)
```

## Migration Files

### Migration: Create Auth Tables
```sql
-- Migration: 20250127120000_create_auth_tables.sql

BEGIN;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create org_memberships table
CREATE TABLE IF NOT EXISTS org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'admin', 'moderator', 'finance', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_memberships_user_id ON org_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org_id ON org_memberships(org_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own memberships"
  ON org_memberships FOR SELECT
  USING (auth.uid() = user_id);

COMMIT;
```
