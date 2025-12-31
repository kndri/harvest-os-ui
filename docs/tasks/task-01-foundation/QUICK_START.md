# Task 01: Quick Start Guide

## ✅ What's Been Completed

All migrations have been pushed and code has been implemented. You're ready to test!

## 🚀 Quick Start

### 1. Start Development Server

```bash
npm run dev
```

### 2. Create a Test User

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/qauwthppncedppwvctfh)
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter email and password (e.g., `test@example.com` / `password123`)
5. Click **Create User**

### 3. Add User to Organization

1. In Supabase Dashboard, go to **SQL Editor**
2. Run this query (replace `<user-id>` with the user ID from step 2):

```sql
INSERT INTO org_memberships (org_id, user_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', '<user-id>', 'admin')
ON CONFLICT DO NOTHING;
```

To get the user ID:
- Go to **Authentication** → **Users**
- Click on the user you created
- Copy the **UUID** (starts with letters/numbers)

### 4. Test the Application

1. **Test Locale Routing:**
   - Navigate to `http://localhost:3000` → Should redirect to `/en`
   - Navigate to `http://localhost:3000/en` → Should show English content
   - Click "FR" button → Should switch to `/fr` with French content

2. **Test Authentication:**
   - Navigate to `http://localhost:3000/auth/login`
   - Sign in with your test user credentials
   - Should redirect to `/en` after login

3. **Test Admin Protection:**
   - While signed in as admin, navigate to `http://localhost:3000/admin`
   - Should see admin dashboard
   - Sign out and try again → Should redirect to login

4. **Test Member Access:**
   - Create another user and add them with role `member`
   - Sign in as member
   - Try to access `/admin` → Should redirect to `/en`

## 🔍 Verify Database

Check that tables were created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see:
   - `organizations` (with test-church entry)
   - `profiles` (empty until users sign up)
   - `org_memberships` (with your test admin entry)

## 📝 Next Steps

Once Task 01 is verified working:

1. **Task 02: Programs Engine**
   - Create programs table
   - Build program CRUD interface
   - Implement bilingual content

2. **Continue with remaining features** from the implementation guide

## 🐛 Troubleshooting

### "Invalid API key" error
- Check `.env.local` has correct keys
- Verify keys start with `sb_publishable_...` and `sb_secret_...`
- Restart dev server after changing env vars

### "Policy violation" or RLS errors
- Verify RLS is enabled on tables
- Check policies are created correctly
- Ensure user is authenticated when accessing protected data

### Middleware not working
- Check `middleware.ts` exists in root
- Verify matcher pattern includes your routes
- Restart dev server

### Login not working
- Check Supabase Auth settings
- Verify email confirmation is disabled (for testing)
- Check browser console for errors
