# MVP PRD — HarvestOS (Next.js + Supabase)
**Version:** 0.1 (MVP)  
**Owner:** HarvestOS Team  
**Stack:** Next.js (App Router) + Supabase (Postgres/RLS/Auth/Storage) + Tailwind + i18n (EN/FR)  
**Deployment:** Vercel (web), Supabase (backend)

## 1) Mission
HarvestOS enables churches to launch and run any program (prayer, fasting, youth/kids weeks, conferences, retreats, teaching series) with a modular bilingual experience (EN/FR), plus an event budgeting module to plan and track finances securely—year after year.

## 2) Goals (MVP)
### Must achieve
- Admin can create and publish a program with configurable modules and branding.
- Users can browse programs, view “today,” read program days, mark days completed, and save notes.
- Admin can create/manage events and speakers for a program.
- Admin can upload and publish resources for a program.
- Users can submit prayer requests; moderators/admins can approve; public sees approved only; “I prayed” increments count.
- Finance/Admin can create a budget event and track:
  - Expenses (projected vs actual, variance, category totals)
  - Revenue (pledges + payments, offerings, other revenue)
  - Attachments (receipts/contracts)
  - Basic per-event summary metrics
- Security: RLS enforced and role-based access works across platform and budgeting.

### Explicit non-goals (MVP)
- Push notifications / scheduled reminders
- Groups/circles, streaks/achievements
- Volunteer management
- Multi-campus support
- Full analytics dashboards (stubs only)
- Rich WYSIWYG editor beyond basic text area (optional upgrade)

## 3) Personas
- **Participant (Member):** consumes content, marks completion, notes, prayer wall.
- **Admin:** creates programs, content, events, resources; publishes; manages speakers.
- **Moderator:** moderates prayer requests.
- **Finance:** manages budgets (expenses/revenue/pledges/offerings/receipts), exports.
- **Viewer/Pastor (optional role):** read-only visibility across org events.

## 4) Core Concepts & Data Model (MVP)
### Programs (programs table)
- Flexible duration (date-based or undated)
- Modular config via JSONB toggles
- Branding JSONB (colors/banner/theme)
- All user-facing program content is bilingual (EN/FR)

### Program Days (program_days table)
- day_index 1..N
- Optional content sections per day (devotional, scriptures, prayer focus, fasting focus, activities, reflection questions, family guide, media)
- Notes enabled flag

### Events & Speakers (program_events + speakers)
- Sessions/services/workshops for a program
- Link to speakers, interpreters, worship leaders
- Optional livestream + location

### Resources (resources + Storage)
- File/link/json resources, tagged by category and language

### Prayer Wall (prayer_requests)
- Program-specific requests
- Moderated visibility (is_approved)
- prayed_count increment mechanism

### Budgeting (organizations, org_memberships, budget_events, line items, revenue)
- Multi-tenant by org_id with RLS
- Budget events track expenses/revenue and receipts
- Audit logs for money fields (MVP required)

## 5) User Journeys (MVP)
### Journey A: Participant completes a day
1. User visits program page → sees today’s content
2. Opens day page → reads content
3. Marks as completed → saved in user_day_progress
4. Writes notes → saved; persists on refresh

### Journey B: Admin launches a 21-day program
1. Create program → set dates (21 days) → enable modules → branding → publish
2. Generate days skeleton (1..21)
3. Fill day content in EN/FR
4. Add events and speakers
5. Upload resources

### Journey C: Prayer wall moderation
1. User submits prayer request (pending)
2. Moderator approves
3. Public sees approved request
4. Users click “I prayed” → prayed_count increments

### Journey D: Finance budgets an event
1. Create Budget Event → pick template “21 Days”
2. Enter expenses projected amounts; record actuals as they happen
3. Create pledges; record payments; enter offerings
4. Upload receipts
5. View summary (projected vs actual + net)

## 6) Requirements
### 6.1 Functional requirements (MVP)
**Programs**
- Create/read/update/publish programs
- Module-driven UI (only enabled modules render)
- Bilingual rendering based on route locale (/en, /fr)

**Daily Content**
- Day pages auto-hide empty sections
- User completion + notes

**Events**
- List and detail views
- Show linked speakers
- Add-to-calendar link (simple ICS or google calendar URL)

**Resources**
- List + filter (category, language)
- Storage-based downloads

**Prayer Wall**
- List approved requests
- Submit request (auth required)
- Moderation queue in admin
- “I prayed” increments prayed_count

**Budgeting**
- Org + memberships + roles
- Budget event CRUD
- Expenses page: line items grouped by category, totals, variance
- Revenue: pledges + payments (balance), offerings, other revenue
- Attachments: upload receipts/contracts
- Audit log on money changes
- Basic per-event summary

### 6.2 Non-functional requirements (MVP)
- Mobile-first UI
- Fast load time (server components for read views)
- Clear error states for saves and uploads
- RLS and least-privilege access
- Stable migration workflow

## 7) Success Criteria (MVP)
- Admin can publish a program and users can complete days end-to-end.
- Moderator can approve prayer requests and public sees only approved.
- Finance can manage one budget event and produce correct totals/net.
- No unauthorized access to admin/budget routes/data (verified via RLS tests).

## 8) Release Plan (MVP)
**Milestone 1:** Foundation (repo + Supabase + i18n + auth)  
**Milestone 2:** Programs engine + days + progress/notes  
**Milestone 3:** Events + speakers + resources + prayer wall + moderation  
**Milestone 4:** Budgeting MVP (expenses/revenue/attachments/audit)  
**Milestone 5:** Hardening (seed data, smoke tests, deployment, docs)

## 9) Risks & Mitigations
- **RLS co**
