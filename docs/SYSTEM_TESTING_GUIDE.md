# HarvestOS System Testing Guide

## Overview

This guide provides comprehensive instructions for testing the HarvestOS platform with realistic demo data. The demo seed creates "Grace Community Church" with multiple programs, events, speakers, resources, prayer requests, and budget data.

## 🚀 Quick Reference: See All Data

**After seeding and creating users, visit these URLs to see FULL data:**

### Public Pages (No Login Required)
- **Landing Page**: `http://localhost:3000/en` or `/fr`
- **Programs List**: `http://localhost:3000/en/programs`
- **Program 1**: `http://localhost:3000/en/programs/21-days-prayer-fasting`
  - Days: `/en/programs/21-days-prayer-fasting/days/1` through `/days/21`
  - Events: `/en/programs/21-days-prayer-fasting/events`
  - Speakers: `/en/programs/21-days-prayer-fasting/speakers`
  - Resources: `/en/programs/21-days-prayer-fasting/resources`
  - Prayer Wall: `/en/programs/21-days-prayer-fasting/prayer-wall`
- **Program 2**: `http://localhost:3000/en/programs/youth-summer-camp-2025`
- **Program 3**: `http://localhost:3000/en/programs/foundations-bible-study`

### Admin Pages (Login Required: `admin@gracechurch.org` / `admin123`)
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Programs Management**: `http://localhost:3000/admin/programs`
- **Budget Dashboard**: `http://localhost:3000/admin/budgets`
- **Budget Event 1**: `http://localhost:3000/admin/budgets/events/[id]` (21 Days Prayer Budget)
- **Budget Event 2**: `http://localhost:3000/admin/budgets/events/[id]` (Youth Camp Budget)

### Member Pages (Login Required: `member@gracechurch.org` / `member123`)
- **Programs List**: `http://localhost:3000/en/programs`
- **Complete Days**: Navigate to any program and click through days 1-21
- **Save Notes**: Add notes on any day page
- **Mark Complete**: Mark days as completed
- **Prayer Requests**: Submit and view prayer requests

### Finance Pages (Login Required: `finance@gracechurch.org` / `finance123`)
- **Budget Dashboard**: `http://localhost:3000/admin/budgets`
- **View Budgets**: See expenses, revenue, variance, audit logs

---

## Prerequisites

### Required Software
- **Node.js** 18+ and npm
- **Supabase CLI** (install via `npm install -g supabase`)
- **Git** (for cloning/running migrations)

### Environment Setup
1. Ensure you have a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Link your local project to Supabase:
   ```bash
   supabase link --project-ref your-project-ref
   ```

## Quick Start

### 1. Reset Database and Seed Demo Data

**For Remote Supabase (Current Setup):**

```bash
# Apply all migrations including enhanced demo seed
supabase db push

# Or if you need a fresh start, reset via Supabase Dashboard:
# Dashboard → Database → Reset Database (use with caution!)
```

**For Local Supabase (if using Docker):**

```bash
# Option A: Using npm script (recommended)
npm run demo

# Option B: Manual commands
supabase db reset
npm run dev
```

The migration will:
- Create Grace Community Church organization
- Seed **38 program days** (21 + 5 + 12) with FULL content
- Create **8 events** across programs
- Add **5 speakers** with complete bios
- Upload **12 resources** (PDFs, links, guides)
- Create **20 prayer requests** (14 approved, 6 pending)
- Set up **2 budget events** with **11 expense items** and **11 revenue items**

### 2. Create Test Users

**Automated Method (Recommended):**

```bash
# This script creates users AND assigns roles automatically
node scripts/create-and-assign-users.js
```

**Manual Method:**

1. Go to **Supabase Dashboard → Authentication → Users → Add User**
2. Create users with these emails:
   - `admin@gracechurch.org` (password: `admin123`)
   - `member@gracechurch.org` (password: `member123`)
   - `moderator@gracechurch.org` (password: `moderator123`)
   - `finance@gracechurch.org` (password: `finance123`)

3. Run `scripts/create-test-users.sql` in Supabase SQL Editor (it has the actual user IDs already filled in)

**Note**: The automated script (`create-and-assign-users.js`) is faster and handles everything automatically.

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the programs list with 3 demo programs.

### 4. Verify Data is Loaded

**Quick Check - Run this SQL in Supabase SQL Editor:**

```sql
-- Check counts - EXPECTED VALUES
SELECT 
  (SELECT COUNT(*) FROM programs) as programs,
  (SELECT COUNT(*) FROM program_days) as days,
  (SELECT COUNT(*) FROM program_events) as events,
  (SELECT COUNT(*) FROM speakers) as speakers,
  (SELECT COUNT(*) FROM resources) as resources,
  (SELECT COUNT(*) FROM prayer_requests) as prayer_requests,
  (SELECT COUNT(*) FROM budget_events) as budget_events,
  (SELECT COUNT(*) FROM budget_line_items) as expenses,
  (SELECT COUNT(*) FROM budget_revenue) as revenue_items;

-- Detailed breakdown
SELECT 'Programs' as type, COUNT(*) as count FROM programs
UNION ALL SELECT 'Program Days', COUNT(*) FROM program_days
UNION ALL SELECT 'Events', COUNT(*) FROM program_events
UNION ALL SELECT 'Speakers', COUNT(*) FROM speakers
UNION ALL SELECT 'Resources', COUNT(*) FROM resources
UNION ALL SELECT 'Prayer Requests (Total)', COUNT(*) FROM prayer_requests
UNION ALL SELECT 'Prayer Requests (Approved)', COUNT(*) FROM prayer_requests WHERE is_approved = true
UNION ALL SELECT 'Prayer Requests (Pending)', COUNT(*) FROM prayer_requests WHERE is_approved = false
UNION ALL SELECT 'Budget Events', COUNT(*) FROM budget_events
UNION ALL SELECT 'Budget Expenses', COUNT(*) FROM budget_line_items
UNION ALL SELECT 'Budget Revenue', COUNT(*) FROM budget_revenue;
```

**Expected Results:**

| Data Type | Expected Count | Where to See It |
|-----------|---------------|-----------------|
| **Programs** | 3 | `/en/programs` |
| **Program Days** | 38 | Program detail → Days navigation |
| **Events** | 8 | Program detail → Events tab |
| **Speakers** | 5 | Program detail → Speakers tab |
| **Resources** | 12 | Program detail → Resources tab |
| **Prayer Requests (Total)** | 20 | Prayer Wall page |
| **Prayer Requests (Approved)** | 14 | Public prayer wall (visible to all) |
| **Prayer Requests (Pending)** | 6 | Admin moderation queue |
| **Budget Events** | 2 | `/admin/budgets` |
| **Budget Expenses** | 11 | Budget detail → Expenses tab |
| **Budget Revenue** | 11 | Budget detail → Revenue tab |

**If counts don't match:**
1. Check migration was applied: `supabase migration list`
2. Re-run migration: `supabase db push`
3. Check for errors in Supabase Dashboard → Logs

---

## Where to See ALL Data in the App

This section shows you exactly where to find every piece of demo data in the application.

### 🏠 Landing Page (`/en` or `/fr`)
- **Hero Section**: Main tagline and CTAs
- **Features Section**: 6 feature cards with icons and descriptions
- **Stats Section**: 4 animated statistics
- **Testimonials**: 3 testimonial cards
- **CTA Section**: Call-to-action for getting started
- **Footer**: Complete footer with links

### 📚 Programs List (`/en/programs` or `/fr/programs`)
**You should see 3 published programs:**
1. **21 Days of Prayer & Fasting** (Jan 6-26, 2025)
2. **Youth Summer Camp 2025** (July 15-19, 2025)
3. **Foundations Bible Study** (Ongoing, 12 weeks)

### 📖 Program 1: 21 Days of Prayer & Fasting (`/en/programs/21-days-prayer-fasting`)

**Program Overview Page:**
- Program description (EN/FR)
- Today's day indicator (if program is active)
- Module tabs: Resources, Events, Speakers, Prayer Wall

**Days Content** (`/en/programs/21-days-prayer-fasting/days/[1-21]`):
- **21 FULL days** with complete content:
  - Day titles (EN/FR)
  - Devotionals (EN/FR) - full paragraphs
  - Scriptures (3 per day) - EN/FR arrays
  - Prayer Focus (EN/FR)
  - Fasting Focus (EN/FR)
  - Notes enabled for all days

**Events** (`/en/programs/21-days-prayer-fasting/events`):
- **3 events**:
  1. Opening Service (Jan 6, 7pm) - Pastor James Mitchell
  2. Mid-Week Prayer Gathering (Jan 15, 7pm) - Pastor James Mitchell
  3. Closing Celebration (Jan 26, 6pm) - Dr. Sarah Williams

**Speakers** (`/en/programs/21-days-prayer-fasting/speakers`):
- **2 speakers** assigned to events:
  - Pastor James Mitchell (Senior Pastor)
  - Dr. Sarah Williams (Guest Speaker)

**Resources** (`/en/programs/21-days-prayer-fasting/resources`):
- **6 resources**:
  1. Prayer Guide (PDF, 2MB)
  2. Fasting Tips (PDF, 1MB)
  3. Daily Devotional Book (PDF, 5MB)
  4. Scripture Reading Plan (PDF, 384KB)
  5. Prayer Journal Template (PDF, 128KB)
  6. Worship Playlist (Spotify link)

**Prayer Wall** (`/en/programs/21-days-prayer-fasting/prayer-wall`):
- **20 prayer requests total**:
  - **14 approved** requests (visible publicly with prayed counts)
  - **6 pending** requests (only visible to submitter and moderators)
  - Mix of anonymous and named requests
  - Prayed counts range from 7 to 42

### 🏕️ Program 2: Youth Summer Camp (`/en/programs/youth-summer-camp-2025`)

**Program Overview:**
- 5-day camp program
- Modules: Resources ✅, Prayer Wall ❌, Events ✅, Speakers ✅

**Days** (`/en/programs/youth-summer-camp-2025/days/[1-5]`):
- **5 days** with activities:
  1. Arrival & Welcome
  2. Morning Devotion & Activities
  3. Adventure Day
  4. Service & Outreach
  5. Closing & Commissioning

**Events** (`/en/programs/youth-summer-camp-2025/events`):
- **5 events**:
  1. Morning Worship (July 15, 9am) - Youth Pastor Mike Chen
  2. Workshop: Identity in Christ (July 16, 2pm) - Youth Pastor Mike Chen
  3. Evening Bonfire (July 17, 7pm) - No speaker
  4. Water Games & Fun (July 18, 2pm) - No speaker
  5. Final Celebration Service (July 19, 7pm) - Youth Pastor Mike Chen

**Speakers** (`/en/programs/youth-summer-camp-2025/speakers`):
- **1 speaker**: Youth Pastor Mike Chen

**Resources** (`/en/programs/youth-summer-camp-2025/resources`):
- **2 resources**:
  1. Camp Schedule (PDF, 512KB)
  2. Permission Form (PDF, 256KB)

### 📖 Program 3: Foundations Bible Study (`/en/programs/foundations-bible-study`)

**Program Overview:**
- 12-week undated program
- Modules: Resources ✅, Prayer Wall ❌, Events ❌, Speakers ❌

**Days** (`/en/programs/foundations-bible-study/days/[1-12]`):
- **12 weeks** with full content:
  - Week titles (EN/FR)
  - Devotionals (EN/FR)
  - Scriptures (3 per week)
  - Reflection Questions (2 per week)

**Resources** (`/en/programs/foundations-bible-study/resources`):
- **4 resources**:
  1. Study Guide (PDF, 3MB)
  2. Video Series (Link)
  3. Discussion Questions (PDF, 512KB)
  4. Memory Verses (PDF, 256KB)

### 👥 All Speakers (`/en/programs/[any-program]/speakers`)

**5 speakers total** (across all programs):
1. **Pastor James Mitchell** - Senior Pastor
   - Bio (EN/FR)
   - Email: james.mitchell@gracechurch.org
   - Website: https://gracechurch.org/james-mitchell
   - **3 events** assigned

2. **Dr. Sarah Williams** - Guest Speaker
   - Bio (EN/FR)
   - Email: sarah.williams@example.com
   - Website: https://sarahwilliams.org
   - **1 event** assigned

3. **Youth Pastor Mike Chen** - Youth Ministry
   - Bio (EN/FR)
   - Email: mike.chen@gracechurch.org
   - **3 events** assigned

4. **Worship Leader Maria Garcia** - Worship
   - Bio (EN/FR)
   - Email: maria.garcia@gracechurch.org

5. **Elder Thomas Brown** - Bible Teacher
   - Bio (EN/FR)
   - Email: thomas.brown@gracechurch.org

### 💰 Budget Management (`/admin/budgets`)

**Budget Events List:**
- **2 budget events**:
  1. **21 Days of Prayer Budget** (Active)
  2. **Youth Summer Camp 2025** (Draft)

**Budget Event 1: 21 Days of Prayer Budget** (`/admin/budgets/events/[id]`)

**Expenses Tab:**
- **7 expense line items** across 5 categories:
  - **Venue**: Main Sanctuary rental ($500/$500)
  - **Printed Materials**: Prayer guides, books ($1,200/$1,350) ⚠️ Over budget
  - **Food**: Refreshments ($300/$285) ✅ Under budget
  - **A/V Equipment**: Sound system ($800/$750) ✅ Under budget
  - **Marketing**: Social media ads ($400/$380) ✅ Under budget
  - **Technology**: Livestream setup ($600/$600) ✅ On budget
  - **Administration**: Coordination costs ($200/$195) ✅ Under budget
  - **Total Expenses**: $3,600 projected / $3,460 actual

**Revenue Tab:**
- **7 revenue items**:
  - **Pledges** (4):
    - John Smith: $500/$500 ✅ Paid
    - Mary Johnson: $300/$200 (Balance: $100)
    - Church Foundation: $1,000/$1,000 ✅ Paid
    - Anonymous Donor: $750/$500 (Balance: $250)
  - **Offerings** (2):
    - General offering: $450/$450 ✅
    - Special prayer offering: $320/$320 ✅
  - **Other** (1):
    - Miscellaneous donations: $150/$150 ✅
  - **Total Revenue**: $3,470 received / $3,720 pledged

**Summary Cards:**
- Expenses Total: $3,460
- Revenue Total: $3,470
- Net: +$10 ✅

**Audit Log Tab:**
- Should show audit entries for any money field changes
- Filterable by date range and field name

**Budget Event 2: Youth Summer Camp 2025** (`/admin/budgets/events/[id]`)

**Expenses Tab:**
- **4 expense line items**:
  - Facility Rental: $5,000/$0 (Pending)
  - Food: $2,500/$0 (To be ordered)
  - Supplies: $800/$0
  - Transportation: $1,200/$0
  - **Total**: $9,500 projected / $0 actual

**Revenue Tab:**
- **4 revenue items**:
  - Camp Sponsor Fund pledge: $2,000/$0 (Balance: $2,000)
  - Local Business Partnership pledge: $1,500/$1,500 ✅ Paid
  - Registration fees (estimated): $3,750/$0
  - Special offering: $800/$800 ✅
  - **Total**: $8,050 received / $8,050 total

### 🔐 Admin Dashboard (`/admin`)

**After logging in as admin:**
- Dashboard cards:
  - Programs (link to `/admin/programs`)
  - Budgets (link to `/admin/budgets`)
  - View Site (link to `/en/programs`)

**Admin Programs** (`/admin/programs`):
- List of all 3 programs
- Can edit, publish, archive

**Admin Program Details** (`/admin/programs/[id]`):
- Edit program settings
- Tabs: Days, Events, Resources, Prayer Requests

**Admin Days** (`/admin/programs/[id]/days`):
- View all days for the program
- See day content preview
- Link to view day publicly

**Admin Events** (`/admin/programs/[id]/events`):
- List all events for the program
- Add/edit/delete events
- Assign speakers

**Admin Resources** (`/admin/programs/[id]/resources`):
- List all resources
- Upload new resources
- Delete resources

**Admin Prayer Requests** (`/admin/programs/[id]/prayer-requests`):
- **Moderation queue**:
  - **6 pending** requests (need approval)
  - **14 approved** requests
- Approve/reject functionality
- View request details

---

## ✅ Data Verification Checklist

Use this checklist to verify all data is present and visible:

### Landing Page (`/en`)
- [ ] Hero section displays with tagline
- [ ] Features section shows 6 feature cards
- [ ] Stats section shows 4 animated numbers
- [ ] Testimonials section shows 3 testimonial cards
- [ ] CTA section displays
- [ ] Footer shows complete links

### Programs List (`/en/programs`)
- [ ] **3 program cards** visible
- [ ] Each card shows title, description, duration
- [ ] Module badges display correctly
- [ ] Clicking a card navigates to program detail

### Program 1: 21 Days Prayer (`/en/programs/21-days-prayer-fasting`)
- [ ] Program overview page loads
- [ ] Description displays (EN/FR)
- [ ] Module tabs visible: Resources, Events, Speakers, Prayer Wall
- [ ] **Days 1-21** all accessible via navigation
- [ ] Each day shows:
  - [ ] Title (EN/FR)
  - [ ] Devotional text (full paragraph)
  - [ ] Scriptures (3 verses)
  - [ ] Prayer focus
  - [ ] Fasting focus
  - [ ] Notes section enabled
- [ ] **Events tab**: Shows 3 events with dates, speakers, locations
- [ ] **Speakers tab**: Shows 2 speakers with bios
- [ ] **Resources tab**: Shows 6 resources
- [ ] **Prayer Wall tab**: Shows 14 approved requests (6 pending hidden)

### Program 2: Youth Camp (`/en/programs/youth-summer-camp-2025`)
- [ ] Program overview loads
- [ ] **5 days** accessible
- [ ] Each day shows activities (EN/FR)
- [ ] **Events tab**: Shows 5 events
- [ ] **Speakers tab**: Shows Youth Pastor Mike Chen
- [ ] **Resources tab**: Shows 2 resources

### Program 3: Foundations (`/en/programs/foundations-bible-study`)
- [ ] Program overview loads
- [ ] **12 weeks** accessible
- [ ] Each week shows devotional, scriptures, reflection questions
- [ ] **Resources tab**: Shows 4 resources

### Admin Dashboard (`/admin`)
- [ ] Login as admin works
- [ ] Dashboard shows 3 cards (Programs, Budgets, View Site)
- [ ] Navigation shows user menu

### Admin Programs (`/admin/programs`)
- [ ] List shows all 3 programs
- [ ] Can click to edit each program
- [ ] Days tab shows all days for each program
- [ ] Events tab shows all events
- [ ] Resources tab shows all resources
- [ ] Prayer Requests tab shows moderation queue

### Budget Dashboard (`/admin/budgets`)
- [ ] Login as finance user works
- [ ] Shows 2 budget events
- [ ] Can click into each budget event

### Budget Event 1: 21 Days Prayer Budget
- [ ] **Overview tab**: Shows summary cards
  - [ ] Expenses total: $3,460
  - [ ] Revenue total: $3,470
  - [ ] Net: +$10
- [ ] **Expenses tab**:
  - [ ] Shows 7 line items
  - [ ] Grouped by category
  - [ ] Shows variance (red for over-budget)
  - [ ] Category subtotals display
- [ ] **Revenue tab**:
  - [ ] Shows 7 revenue items
  - [ ] Pledges show balance calculations
  - [ ] Can record payments
- [ ] **Audit Log tab**:
  - [ ] Shows audit entries (if any changes made)
  - [ ] Filters work

### Budget Event 2: Youth Camp Budget
- [ ] Shows draft status
- [ ] 4 expense items (all $0 actual - pending)
- [ ] 4 revenue items
- [ ] Shows planning phase

---

## Demo Data Overview

### Organization
- **Grace Community Church** (slug: `grace-community`)

### Programs (3)

1. **21 Days of Prayer & Fasting**
   - Status: Published
   - Dates: Jan 6-26, 2025
   - **21 FULL days** with complete devotionals, scriptures, prayer/fasting focus (EN/FR)
   - **3 events** (opening, mid-week, closing) with speakers
   - **2 speakers** assigned (Pastor James, Dr. Williams)
   - **6 resources** (prayer guide, fasting tips, devotional book, scripture plan, journal template, playlist)
   - **20 prayer requests** (14 approved, 6 pending)

2. **Youth Summer Camp 2025**
   - Status: Published
   - Dates: July 15-19, 2025
   - **5 days** with full activity descriptions
   - **5 events** (morning worship, workshop, bonfire, water games, final service)
   - **1 speaker** (Youth Pastor Mike Chen)
   - **2 resources** (schedule, permission form)

3. **Foundations Bible Study**
   - Status: Published
   - Undated (ongoing)
   - **12 weeks** with full devotionals, scriptures, reflection questions
   - **4 resources** (study guide, video series, discussion questions, memory verses)

### Speakers (5)
- Pastor James Mitchell (Senior Pastor)
- Dr. Sarah Williams (Guest Speaker)
- Youth Pastor Mike Chen
- Worship Leader Maria Garcia
- Elder Thomas Brown

### Budget Events (2)
1. **21 Days of Prayer Budget** (Active)
   - **7 expense line items** across 5 categories ($3,600 projected / $3,460 actual)
   - **7 revenue items** ($3,470 received / $3,720 total pledged)
   - Net: +$10 (positive)
   - Complete variance tracking (over/under budget indicators)

2. **Youth Summer Camp 2025** (Draft)
   - **4 expense line items** ($9,500 projected / $0 actual - pending)
   - **4 revenue items** ($8,050 received / $8,050 total)
   - Shows planning phase with projected amounts

---

## Feature Testing Flows

### Flow 1: Admin Creates and Publishes a Program

**Prerequisites:** Login as admin user

**Steps:**
1. Navigate to `/admin/programs`
2. Click "New Program" button
3. Fill in the form:
   - English Title: `Test Program`
   - French Title: `Programme Test`
   - Slug: `test-program`
   - Duration: `7` days
   - Start Date: Select a future date
   - End Date: Select end date
   - Check "This is a dated program"
   - Enable modules: Resources, Prayer Wall, Events, Speakers
4. Click "Create Program"
5. Verify program appears in admin list
6. Click on the program to edit
7. Navigate to `/admin/programs/[id]/days` (if page exists)
8. Add day content for days 1-7
9. Navigate to `/admin/programs/[id]/events`
10. Add an event with a speaker
11. Navigate to `/admin/programs/[id]/resources`
12. Upload a test resource
13. Click "Publish" button
14. Navigate to `/en/programs` and verify program appears

**Verification Checklist:**
- [ ] Program created successfully
- [ ] Days can be added/edited
- [ ] Events can be created
- [ ] Resources can be uploaded
- [ ] Program publishes and appears publicly
- [ ] All modules display correctly on public page

---

### Flow 2: Member Completes Program Days

**Prerequisites:** Login as member user

**Steps:**
1. Navigate to `/en` (or `/fr` for French)
2. Browse programs list - should see 3 demo programs
3. Click on "21 Days of Prayer & Fasting"
4. Verify program overview page shows:
   - Program description
   - Today's day (if program is active)
   - Module tabs (Resources, Events, Speakers, Prayer Wall)
5. Click on "Day 1" or navigate to `/en/programs/21-days-prayer-fasting/days/1`
6. Read the devotional content
7. Scroll down and add notes in the notes section
8. Click "Save Notes"
9. Click "Mark as Complete"
10. Verify completion indicator appears
11. Navigate to day 2 and repeat
12. Check progress indicator (if displayed)

**Verification Checklist:**
- [ ] Programs list displays correctly
- [ ] Program detail page loads with all content
- [ ] Day content displays (devotional, scriptures, prayer focus, fasting focus)
- [ ] Notes can be saved and persist on refresh
- [ ] Day completion works and persists
- [ ] Progress tracking updates

---

### Flow 3: Prayer Wall Moderation

**Prerequisites:** 
- Login as member (to submit request)
- Login as moderator (to approve)

**Steps (Member):**
1. Navigate to `/en/programs/21-days-prayer-fasting/prayer-wall`
2. Scroll to see approved prayer requests
3. Click "I prayed" on a few requests
4. Verify prayed_count increments
5. Fill out prayer request form:
   - Enter prayer request text
   - Choose anonymous or not
   - Submit
6. Verify request appears in "Your Requests" section (pending)

**Steps (Moderator):**
1. Login as moderator
2. Navigate to `/admin/programs/[program-id]/prayer-requests`
3. View pending requests queue
4. Click "Approve" on a pending request
5. Verify request moves to approved section
6. Navigate back to public prayer wall
7. Verify approved request now appears publicly

**Verification Checklist:**
- [ ] Public prayer wall shows only approved requests
- [ ] "I prayed" button increments counter
- [ ] Members can submit prayer requests
- [ ] Moderator can view pending queue
- [ ] Moderator can approve/reject requests
- [ ] Approved requests appear on public wall
- [ ] Anonymous requests hide user identity

---

### Flow 4: Budget Management

**Prerequisites:** Login as finance user

**Steps:**
1. Navigate to `/admin/budgets`
2. View existing budget events (should see 2 demo budgets)
3. Click on "21 Days of Prayer Budget"
4. Verify overview page shows:
   - Summary cards (expenses total, revenue total, net)
   - Tabs: Overview, Expenses, Revenue, Audit Log
5. Click "Expenses" tab
6. Verify expenses grouped by category
7. Verify variance calculations (red for over-budget)
8. Click "Add Line Item"
9. Fill form:
   - Category: `Marketing`
   - Description: `Social media ads`
   - Projected Amount: `500.00`
   - Actual Amount: `450.00`
10. Save and verify line item appears
11. Click "Revenue" tab
12. View existing revenue items
13. Click "Record Payment" on a pledge
14. Enter payment amount (e.g., `100.00`)
15. Verify balance updates
16. Click "Audit Log" tab
17. Verify audit entries show changes to money fields
18. Test filters (date range, field name)

**Verification Checklist:**
- [ ] Budget events list displays
- [ ] Budget detail page loads with all tabs
- [ ] Expenses grouped by category with subtotals
- [ ] Variance calculations correct (projected vs actual)
- [ ] Revenue items display correctly
- [ ] Pledge payments update balance
- [ ] Audit logs capture money field changes
- [ ] Filters work correctly

---

### Flow 5: Events and Speakers

**Prerequisites:** Login as member or admin

**Steps:**
1. Navigate to `/en/programs/21-days-prayer-fasting/events`
2. Verify events list shows:
   - Upcoming events (if dates are future)
   - Past events (if dates are past)
   - Events ordered by date
3. Click on an event
4. Verify event detail shows:
   - Event title and description
   - Date and time
   - Location
   - Speaker information (if assigned)
   - "Add to Calendar" button
5. Click "Add to Calendar" - verify ICS file downloads
6. Navigate to `/en/programs/21-days-prayer-fasting/speakers`
7. Verify speakers list displays
8. Click on a speaker
9. Verify speaker detail shows:
   - Name and bio
   - Photo (if available)
   - Email/website (if available)
   - List of events they're speaking at

**Verification Checklist:**
- [ ] Events list displays correctly
- [ ] Events sorted by date
- [ ] Event detail page shows all information
- [ ] Speaker information displays
- [ ] "Add to Calendar" works
- [ ] Speakers list displays
- [ ] Speaker detail page shows bio and events

---

### Flow 6: Resources Library

**Prerequisites:** Login as member

**Steps:**
1. Navigate to `/en/programs/21-days-prayer-fasting/resources`
2. Verify resources list displays
3. Test category filter - select a category
4. Verify filtered results
5. Test language filter - select "English", "French", or "Both"
6. Verify filtered results
7. Click on a resource card
8. Verify resource detail/download works
9. Navigate to admin resources page
10. Verify admin can upload resources
11. Upload a test PDF
12. Verify resource appears in public list

**Verification Checklist:**
- [ ] Resources list displays
- [ ] Category filter works
- [ ] Language filter works
- [ ] Resources can be downloaded/viewed
- [ ] Admin can upload resources
- [ ] Uploaded resources appear publicly

---

## Verification Checklists

### Authentication & Authorization
- [ ] Unauthenticated users redirected from `/admin`
- [ ] Admin users can access all admin routes
- [ ] Finance users can access budget routes
- [ ] Members cannot access admin routes
- [ ] RLS policies prevent cross-organization data access

### Programs Engine
- [ ] Programs list displays published programs
- [ ] Program detail page shows correct language content
- [ ] Modules appear/disappear based on config
- [ ] Dated programs show "today's day"
- [ ] Undated programs show all days

### Program Days
- [ ] Day content displays correctly
- [ ] Empty sections are hidden
- [ ] Notes can be saved
- [ ] Day completion works
- [ ] Progress tracking updates

### Events & Speakers
- [ ] Events list displays
- [ ] Event detail shows speaker info
- [ ] Speakers list displays
- [ ] Speaker detail shows events
- [ ] "Add to Calendar" works

### Resources
- [ ] Resources list displays
- [ ] Filters work (category, language)
- [ ] Resources can be downloaded
- [ ] Admin can upload resources

### Prayer Wall
- [ ] Only approved requests show publicly
- [ ] "I prayed" increments counter
- [ ] Members can submit requests
- [ ] Moderator can approve/reject
- [ ] Anonymous requests hide identity

### Budgeting
- [ ] Budget events list displays
- [ ] Expenses grouped by category
- [ ] Variance calculations correct
- [ ] Revenue items display
- [ ] Pledge payments update balance
- [ ] Audit logs capture changes
- [ ] Filters work correctly

---

## Troubleshooting

### Database Reset Issues

**Problem:** `supabase db reset` fails
- **Solution:** Ensure Supabase CLI is linked: `supabase link --project-ref your-ref`
- Check migration files are valid SQL
- Verify Supabase project is accessible

### Demo Data Not Appearing

**Problem:** After reset, no demo programs appear
- **Solution:** 
  1. Check migration ran: `supabase migration list`
  2. Verify migration file exists: `supabase/migrations/20251231200000_seed_demo_data.sql`
  3. Check for errors: `supabase db reset --debug`

### Authentication Issues

**Problem:** Cannot login or access routes
- **Solution:**
  1. Verify user exists in Supabase Auth
  2. Check org_membership record exists
  3. Verify role is correct
  4. Check RLS policies are applied

### RLS Policy Errors

**Problem:** "Row Level Security policy violation"
- **Solution:**
  1. Verify user has org_membership
  2. Check role matches policy requirements
  3. Verify policies are enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

### Missing Pages/Routes

**Problem:** 404 errors on expected routes
- **Solution:**
  1. Verify file exists in `app/` directory
  2. Check route structure matches Next.js conventions
  3. Restart dev server: `npm run dev`

---

## NPM Scripts Reference

```bash
# Reset database and seed demo data, then start dev server
npm run demo

# Reset database only
npm run db:reset

# Apply migrations (includes demo seed)
npm run db:seed-demo

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## Next Steps

After completing testing:

1. **Create Additional Test Data:**
   - Add more programs with different configurations
   - Create users with different roles
   - Test edge cases (empty states, large datasets)

2. **Performance Testing:**
   - Test with large numbers of programs
   - Test with many prayer requests
   - Test budget calculations with many line items

3. **Integration Testing:**
   - Test full user journeys end-to-end
   - Test role-based access across all features
   - Test bilingual content switching

4. **Production Readiness:**
   - Review RLS policies
   - Test error handling
   - Verify audit logging works correctly
   - Test file uploads/downloads

---

## Quick Test Flow (15 Minutes)

Follow this flow to quickly verify all data is visible:

### Step 1: Public Pages (5 min)
1. Visit `http://localhost:3000/en`
2. Scroll through landing page - verify all sections render
3. Click "Get Started" → should go to login
4. Click "Back to Home" → return to landing
5. Navigate to `/en/programs`
6. Verify 3 program cards display
7. Click on "21 Days of Prayer & Fasting"
8. Verify program overview shows all tabs
9. Click through Days 1, 5, 10, 15, 21 - verify content loads
10. Click Events tab - verify 3 events show
11. Click Speakers tab - verify 2 speakers show
12. Click Resources tab - verify 6 resources show
13. Click Prayer Wall tab - verify 14 approved requests show

### Step 2: Login as Member (3 min)
1. Go to `/auth/login`
2. Login as `member@gracechurch.org` / `member123`
3. Should redirect to `/en/programs`
4. Navigate to a program day
5. Add notes and save
6. Mark day as complete
7. Verify notes persist on refresh
8. Verify completion indicator shows

### Step 3: Login as Admin (4 min)
1. Logout (or use incognito)
2. Login as `admin@gracechurch.org` / `admin123`
3. Should redirect to `/admin`
4. Verify dashboard shows 3 cards
5. Click "Programs" → verify 3 programs list
6. Click on a program → verify edit page loads
7. Click "Days" tab → verify all days listed
8. Click "Events" tab → verify events listed
9. Click "Resources" tab → verify resources listed
10. Click "Prayer Requests" tab → verify 6 pending requests

### Step 4: Login as Finance (3 min)
1. Logout
2. Login as `finance@gracechurch.org` / `finance123`
3. Navigate to `/admin/budgets`
4. Verify 2 budget events show
5. Click on "21 Days of Prayer Budget"
6. Verify Overview shows totals
7. Click "Expenses" tab → verify 7 items, variance colors
8. Click "Revenue" tab → verify 7 items, balances
9. Click "Audit Log" tab → verify log viewer works

## Resetting and Reseeding

If you need to start fresh with FULL demo data:

**For Remote Supabase:**

```bash
# 1. Apply enhanced migrations
supabase db push

# 2. Recreate test users (if needed)
node scripts/create-and-assign-users.js

# 3. Start dev server
npm run dev
```

**For Local Supabase (Docker):**

```bash
# Option 1: Full reset (recommended)
npm run demo

# Option 2: Reset and recreate users
npm run db:reset
node scripts/create-and-assign-users.js
npm run dev
```

**Manual Reset via Supabase Dashboard:**
1. Go to Supabase Dashboard → Database → Reset Database
2. ⚠️ **Warning**: This deletes ALL data
3. Then run: `supabase db push`
4. Then run: `node scripts/create-and-assign-users.js`

**Note**: After reset, you'll need to recreate test users. Use `scripts/create-and-assign-users.js` to automate this.

## Support

For issues or questions:
- Check migration logs: `supabase migration list`
- Review Supabase logs: Supabase Dashboard → Logs
- Check Next.js console for errors
- Review RLS policies in Supabase Dashboard → Authentication → Policies
- Verify data exists: Run the SQL verification query in "Verify Data is Loaded" section
