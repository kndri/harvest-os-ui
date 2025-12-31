# Task 01: Foundation - Implementation Guide

This guide provides step-by-step instructions to implement Task 01: Foundation features.

## Overview

Task 01 includes:
1. **Authentication & Role-Based Access Control** - User auth, roles, RLS
2. **Organization Multi-Tenancy** - Multi-org support with data isolation
3. **i18n Setup** - English/French internationalization

## Prerequisites

- Next.js project initialized
- Supabase project created
- Environment variables configured

## Step 1: Set Up Supabase

### 1.1 Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D @supabase/cli
```

### 1.2 Initialize Supabase

```bash
npx supabase init
```

### 1.3 Configure Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
```

**Important Notes:**

1. **Publishable Key** (`sb_publishable_...`): 
   - Safe to expose in client-side code (browser, mobile apps)
   - Respects Row Level Security (RLS) policies
   - Use for all client-side operations
   - Can be bundled in source code

2. **Secret Key** (`sb_secret_...`):
   - **NEVER expose in client-side code** (browser, mobile apps, public repos)
   - Bypasses RLS - has full database access
   - Use only in secure server-side code (API routes, server actions, Edge Functions)
   - Store securely and never commit to version control

**Where to Find Keys:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API Keys**
3. For new projects: Copy the **Publishable key** (starts with `sb_publishable_...`)
4. For server-side operations: Create a **Secret key** if you don't have one (click "Create new API Keys")
5. For legacy projects: You can still use `anon` and `service_role` keys during transition, but prefer the new keys

**Security Best Practices:**

- ✅ Use publishable key in all client-side code
- ✅ Use secret key only in server-side code (API routes, server actions)
- ✅ Never log secret keys (if logging, log only first 6 characters)
- ✅ Use environment variables, never hardcode keys
- ✅ Rotate secret keys immediately if compromised
- ❌ Never use secret key in browser (even localhost)
- ❌ Never commit secret keys to git
- ❌ Never share secret keys in chat/email

Reference: [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)

## Step 2: Create Database Migrations

### 2.1 Create Organizations Table

```bash
npx supabase migration new create_organizations
```

Edit `supabase/migrations/[timestamp]_create_organizations.sql`:
```sql
BEGIN;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

COMMIT;
```

### 2.2 Create Profiles Table

```bash
npx supabase migration new create_profiles
```

Edit migration file:
```sql
BEGIN;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

COMMIT;
```

### 2.3 Create Org Memberships Table

```bash
npx supabase migration new create_org_memberships
```

Edit migration file (see `feature-auth-rbac/backend.md` for full SQL).

### 2.4 Apply Migrations

```bash
npx supabase db push
```

## Step 3: Set Up Supabase Client Helpers

### 3.1 Create Server Client

Create `lib/supabase/server.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side operations.
 * Uses the publishable key - respects RLS policies.
 * For operations that need to bypass RLS, use createServiceClient() instead.
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

**Note:** The `@supabase/ssr` package handles session management automatically. The publishable key respects RLS policies, so user data is properly isolated by organization.

### 3.2 Create Client Client

Create `lib/supabase/client.ts`:
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

**Important:** 
- The publishable key is safe to bundle in your client-side code
- All database queries will respect RLS policies
- User authentication is handled separately via Supabase Auth
- Never use the secret key in this file

## Step 4: Implement Authentication

### 4.1 Create Login Page

Create `app/auth/login/page.tsx`:
```typescript
import { LoginForm } from '@/components/auth/LoginForm';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(searchParams.redirect || '/en');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
```

### 4.2 Create Login Form Component

Create `components/auth/LoginForm.tsx` (see `feature-auth-rbac/frontend.md`).

### 4.3 Create Protected Route Component

Create `components/auth/ProtectedRoute.tsx` (see `feature-auth-rbac/frontend.md`).

### 4.4 Create Auth Hook

Create `hooks/useAuth.ts` (see `feature-auth-rbac/frontend.md`).

## Step 5: Implement Middleware

Create `middleware.ts`:
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle locale routing
  const pathnameHasLocale = /^\/(en|fr)(\/|$)/.test(pathname);
  
  if (!pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const locale = 'en';
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check role (simplified - implement full check)
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      return NextResponse.redirect(new URL('/en', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Step 6: Set Up i18n

### 6.1 Create Dictionary Files

Create `lib/i18n/dictionaries/en.json`:
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "auth": {
    "signIn": "Sign In",
    "signOut": "Sign Out"
  }
}
```

Create `lib/i18n/dictionaries/fr.json`:
```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer"
  },
  "auth": {
    "signIn": "Se connecter",
    "signOut": "Se déconnecter"
  }
}
```

### 6.2 Create i18n Helper

Create `lib/i18n/index.ts` (see `feature-i18n-setup/frontend.md`).

### 6.3 Create Language Switcher

Create `components/layout/LanguageSwitcher.tsx` (see `feature-i18n-setup/frontend.md`).

## Step 7: Create Test Data

### 7.1 Create Seed Migration

```bash
npx supabase migration new seed_initial_data
```

Edit migration file:
```sql
BEGIN;

-- Create test organization
INSERT INTO organizations (id, name, slug)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Test Church', 'test-church')
ON CONFLICT (id) DO NOTHING;

-- Note: Users and memberships should be created via Supabase Auth UI or API

COMMIT;
```

## Step 8: Testing

### 8.1 Test Authentication

1. Start dev server: `npm run dev`
2. Navigate to `/auth/login`
3. Sign in with test credentials
4. Verify redirect to `/en`
5. Verify session persists on reload

### 8.2 Test Authorization

1. Sign in as member user
2. Try to access `/admin`
3. Verify redirect to `/en`
4. Sign in as admin user
5. Verify access to `/admin`

### 8.3 Test i18n

1. Navigate to `/en`
2. Click language switcher to FR
3. Verify URL changes to `/fr`
4. Verify content language changes

### 8.4 Test RLS

1. Create test user in Organization A
2. Create test user in Organization B
3. Sign in as User A
4. Query programs - should only see Org A programs
5. Sign in as User B
6. Query programs - should only see Org B programs

## Step 9: Verification Checklist

- [ ] Supabase project configured
- [ ] **API keys configured** (publishable key for client, secret key for server)
- [ ] **Environment variables set** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`)
- [ ] Migrations applied successfully
- [ ] Server and client Supabase helpers created
- [ ] **Using publishable key in client-side code** (verify no secret key exposure)
- [ ] Login page functional
- [ ] Protected routes working
- [ ] Middleware redirects correctly
- [ ] RLS policies enforced
- [ ] i18n dictionaries created
- [ ] Language switcher works
- [ ] Test data seeded
- [ ] **Secret key only used in server-side code** (verify no browser usage)
- [ ] All acceptance criteria met (see feature docs)

## Next Steps

After completing Task 01, proceed to:
- **Task 02**: Programs Engine
  - Feature: Programs Engine
  - Feature: Program Days
  - Feature: Day Progress

## Troubleshooting

### Migration Errors
- Check Supabase connection
- Verify SQL syntax
- Check for existing tables

### Auth Issues
- Verify environment variables are set correctly
- Check that you're using `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`)
- Verify the publishable key starts with `sb_publishable_...`
- Check Supabase Auth settings in dashboard
- Verify RLS policies are enabled and configured correctly
- If using legacy `anon`/`service_role` keys, ensure they're still active in API Keys dashboard

### API Key Issues
- **"Invalid API key"**: Verify you copied the full key (publishable keys start with `sb_publishable_...`)
- **"Unauthorized" in browser**: Never use secret key in browser - use publishable key
- **RLS not working**: Ensure you're using publishable key (secret key bypasses RLS)
- **Key rotation**: If rotating keys, update all environment variables and redeploy
- **Legacy keys**: If migrating from `anon`/`service_role`, you can use both during transition

### i18n Issues
- Check middleware configuration
- Verify dictionary files exist
- Check locale parameter parsing

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Understanding API Keys](https://supabase.com/docs/guides/api/api-keys) - **Important: Read this for API key best practices**
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- Feature Documentation:
  - [Auth & RBAC](./feature-auth-rbac/)
  - [Org Multi-Tenancy](./feature-org-multi-tenancy/)
  - [i18n Setup](./feature-i18n-setup/)

## API Key Migration (Legacy Projects)

If you're migrating from the old JWT-based `anon`/`service_role` keys:

1. **Create new keys** in Supabase Dashboard → Settings → API Keys
2. **Update environment variables** gradually:
   - Start with publishable key for new features
   - Keep legacy keys active during transition
   - Update all clients to use new keys
3. **Verify no usage** of old keys using the "Last used" indicators in dashboard
4. **Deactivate old keys** once all clients are migrated
5. **Monitor** for any issues after deactivation

**Benefits of new keys:**
- Independent rotation without downtime
- Better security (no 10-year JWT expiry)
- Easier to manage multiple keys per project
- Improved observability and logging
