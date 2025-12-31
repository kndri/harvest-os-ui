# Testing: Authentication & Role-Based Access Control

## Unit Tests

### Auth Helper Functions

**lib/supabase/server.test.ts**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createServerClient, getUserRole } from '@/lib/supabase/server';

describe('Auth Helpers', () => {
  describe('getUserRole', () => {
    it('should return user role for organization', async () => {
      // Mock Supabase client
      const role = await getUserRole('org-123');
      expect(role).toBe('admin');
    });

    it('should return "member" as default role', async () => {
      const role = await getUserRole('org-123');
      expect(role).toBe('member');
    });
  });
});
```

## Integration Tests

### RLS Policy Tests

**tests/integration/rls-policies.test.ts**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('RLS Policies', () => {
  let supabase: ReturnType<typeof createClient>;

  beforeEach(() => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  });

  describe('org_memberships', () => {
    it('should allow users to view their own memberships', async () => {
      // Sign in as test user
      await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      const { data, error } = await supabase
        .from('org_memberships')
        .select('*')
        .eq('user_id', 'test-user-id');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should prevent users from viewing other users memberships', async () => {
      await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      const { data, error } = await supabase
        .from('org_memberships')
        .select('*')
        .eq('user_id', 'other-user-id');

      expect(data).toHaveLength(0);
    });
  });
});
```

## E2E Tests

### Authentication Flow

**tests/e2e/auth.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/en');
  });

  test('user is redirected to login when accessing protected route', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('redirect=%2Fadmin');
  });

  test('non-admin cannot access admin routes', async ({ page }) => {
    // Sign in as member
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'member@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/admin');
    
    await expect(page).toHaveURL('/en');
  });

  test('finance user can access budget routes', async ({ page }) => {
    // Sign in as finance user
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'finance@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/admin/budgets');
    
    await expect(page).toHaveURL('/admin/budgets');
  });
});
```

## Manual Testing Checklist

### Authentication
- [ ] User can sign in with valid credentials
- [ ] User cannot sign in with invalid credentials
- [ ] Error message displays for invalid credentials
- [ ] User can sign out
- [ ] Session persists across page reloads
- [ ] Expired session redirects to login

### Authorization
- [ ] Unauthenticated user redirected to login from `/admin`
- [ ] Member user redirected to `/en` from `/admin`
- [ ] Admin user can access `/admin` routes
- [ ] Finance user can access `/admin/budgets`
- [ ] Finance user cannot access `/admin/programs`
- [ ] Moderator can access prayer moderation queue
- [ ] Moderator cannot access budget routes

### RLS Verification
- [ ] User can only see their own profile
- [ ] User can only see their own org memberships
- [ ] User cannot query data from other organizations
- [ ] RLS policies prevent unauthorized data access

## Test Data Setup

**tests/fixtures/auth.ts**
```typescript
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  },
  member: {
    email: 'member@test.com',
    password: 'password123',
    role: 'member',
  },
  finance: {
    email: 'finance@test.com',
    password: 'password123',
    role: 'finance',
  },
  moderator: {
    email: 'moderator@test.com',
    password: 'password123',
    role: 'moderator',
  },
};

export async function createTestUser(user: typeof testUsers.admin) {
  // Create user in Supabase Auth
  // Create profile
  // Create org membership with role
}
```

## Performance Testing

- [ ] Auth check completes in < 100ms
- [ ] RLS policy evaluation doesn't significantly slow queries
- [ ] Session refresh doesn't block page load
- [ ] Multiple concurrent auth requests handled correctly
