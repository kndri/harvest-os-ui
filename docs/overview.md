# OVERVIEW.md — HarvestOS
HarvestOS is a modular bilingual (EN/FR) church programs platform with an integrated event budgeting module.

## What HarvestOS Does
### Programs & Discipleship
- Create and run any church program (prayer, fasting, youth, kids, conferences, teaching series)
- Flexible durations (1 day → multi-week; date-based or undated)
- Module-driven UI (enable/disable features per program)
- Bilingual content management (English/French)

### Engagement
- Program day completion tracking
- Personal notes per day
- Prayer wall with moderation and “I prayed” counter

### Operations
- Program schedules (events/sessions)
- Speakers directory
- Resources library (PDFs/media)

### Finance (Budgeting)
- Budget events for any church initiative
- Expenses: projected vs actual, category totals, variance
- Revenue: pledges + payments, offerings, other revenue
- Attachments for receipts/contracts
- Audit logging for financial edits

## Tech Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Supabase: Postgres + RLS, Auth, Storage
- Deployed on Vercel

## Repository Structure (suggested)
- `app/` Next.js routes (public, auth, admin)
- `components/` UI components
- `lib/supabase/` server + client helpers
- `lib/i18n/` dictionaries and locale utilities
- `supabase/migrations/` SQL migrations

## Environments
Create `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- `SUPABASE_SERVICE_ROLE_KEY=...` (server-only)

## MVP Scope
See `docs/MVP_PRD.md` and `docs/FEATURES.md`.
