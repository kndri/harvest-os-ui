# Requirements Engineering — HarvestOS

**Version:** 1.0  
**Last Updated:** 2025-01-27  
**Related Docs:** [MVP PRD](./mvp-prd.md), [Features](./features.md), [Overview](./overview.md)

---

## Table of Contents

1. [High-Level Features Breakdown](#1-high-level-features-breakdown)
2. [Technical Specifications](#2-technical-specifications)
3. [UI/UX Requirements](#3-uiux-requirements)
4. [Error Handling Requirements](#4-error-handling-requirements)
5. [Database Migration Strategy](#5-database-migration-strategy)

---

## 1. High-Level Features Breakdown

### 1.1 Feature Domains

#### Domain: Authentication & Authorization
**Related Files:** `features.md` (Section 1)

**Features:**
- User authentication (email/password via Supabase Auth)
- Role-based access control (RBAC)
  - Roles: `member`, `admin`, `moderator`, `finance`, `viewer`
- Row-Level Security (RLS) enforcement
- Organization-based multi-tenancy
- Session management

**User Personas:**
- All authenticated users
- Admin users
- Finance users
- Moderators

**Acceptance Criteria:**
```gherkin
Feature: Auth and Role Access

  Scenario: Non-admin cannot access /admin
    Given a signed-in user with role "member"
    When they navigate to "/admin"
    Then they are redirected to "/en"
    And they see an error message "Access denied"

  Scenario: Finance user can access budgeting routes
    Given a signed-in user with role "FINANCE"
    When they navigate to "/admin/budgets"
    Then the budgets dashboard loads
    And they can view budget events for their organization

  Scenario: RLS blocks unauthorized data access
    Given a user who is not in the organization
    When they query budget events for that org
    Then the query returns no rows
    And no error is exposed to the user

  Scenario: Unauthenticated user cannot access protected routes
    Given an unauthenticated user
    When they navigate to "/admin"
    Then they are redirected to "/auth/login"
    And the original URL is preserved for redirect after login
```

---

#### Domain: Programs Engine
**Related Files:** `features.md` (Section 2), `mvp-prd.md` (Section 4)

**Features:**
- Program CRUD operations
- Modular program configuration (enable/disable features per program)
- Bilingual content (EN/FR)
- Flexible duration (date-based or undated)
- Program branding (colors, banner, theme)
- Program publishing/unpublishing

**User Personas:**
- Admin (creates/manages programs)
- Member (views programs)

**Acceptance Criteria:**
```gherkin
Feature: Programs are modular and bilingual

  Scenario: Only enabled modules appear
    Given a program has config.resources = true and config.prayer_wall = false
    When a user visits the program page
    Then the Resources tab is visible
    And the Prayer Wall tab is not visible
    And the navigation menu excludes prayer wall

  Scenario: Program renders in selected language
    Given a program has title_en = "21 Day Fast" and title_fr = "Jeûne de 21 jours"
    When a user visits "/fr/programs/the-program"
    Then the French title "Jeûne de 21 jours" displays
    And all program content is in French
    And the language switcher shows "FR" as active

  Scenario: Unpublished program is hidden from public
    Given a program with status = "draft"
    When an unauthenticated user visits "/en/programs/the-program"
    Then they receive a 404 error
    And admin users can still access via "/admin/programs/the-program"

  Scenario: Program branding applies to all pages
    Given a program has branding.primary_color = "#FF5733"
    When a user visits any page under "/en/programs/the-program"
    Then the primary color #FF5733 is used for buttons and accents
```

---

#### Domain: Program Days & Progress
**Related Files:** `features.md` (Section 3), `mvp-prd.md` (Section 4)

**Features:**
- Day content management (devotional, scriptures, prayer focus, fasting focus, activities, reflection questions, family guide, media)
- Day completion tracking
- Personal notes per day
- Day index navigation (1..N)
- "Today" detection for date-based programs

**User Personas:**
- Admin (creates/manages day content)
- Member (views days, marks completion, saves notes)

**Acceptance Criteria:**
```gherkin
Feature: Completion and Notes

  Scenario: User marks day complete
    Given a signed-in user is on a program day page
    When they click "Mark as completed"
    Then user_day_progress.completed_at is set to current timestamp
    And the UI shows a checkmark or "Completed" badge
    And the completion persists on page reload

  Scenario: Notes persist
    Given a signed-in user saved notes for day 2
    When they reload the day page
    Then the notes are displayed in the notes section
    And the notes are editable
    And changes auto-save after 2 seconds of inactivity

  Scenario: Empty sections are hidden
    Given a day has devotional content but no fasting focus
    When the day page renders
    Then the devotional section is visible
    And the fasting focus section is not rendered

  Scenario: Today detection works for date-based programs
    Given a program with start_date = "2025-01-01" and duration = 21 days
    And today is "2025-01-15"
    When a user visits the program page
    Then day 15 is highlighted as "Today"
    And the "Today" link navigates to "/en/programs/the-program/days/15"
```

---

#### Domain: Events & Speakers
**Related Files:** `features.md` (Section 4), `mvp-prd.md` (Section 4)

**Features:**
- Event CRUD operations
- Event scheduling (start/end times, dates)
- Speaker management
- Event-speaker linking
- Optional livestream URLs
- Optional location information
- Add-to-calendar functionality (ICS/Google Calendar)

**User Personas:**
- Admin (creates/manages events and speakers)
- Member (views events and speaker profiles)

**Acceptance Criteria:**
```gherkin
Feature: Events and Speakers

  Scenario: Events list shows upcoming sessions
    Given a program has future events
    When a user visits the events page
    Then events are ordered by starts_at ascending
    And past events are shown below upcoming events
    And each event shows date, time, and speaker name

  Scenario: Speaker is displayed on event detail
    Given an event has a speaker_id
    When a user opens the event detail
    Then the speaker profile is displayed
    And the speaker's bio and photo are shown
    And clicking the speaker name navigates to speaker detail page

  Scenario: Add to calendar generates ICS file
    Given an event with start_time and end_time
    When a user clicks "Add to Calendar"
    Then an ICS file is generated with correct event details
    And the file downloads automatically

  Scenario: Events filter by date range
    Given events exist across multiple months
    When a user selects a date range filter
    Then only events within that range are displayed
```

---

#### Domain: Resources Library
**Related Files:** `features.md` (Section 5), `mvp-prd.md` (Section 4)

**Features:**
- Resource CRUD operations
- File upload (PDFs, media files)
- Resource categorization
- Language filtering
- Storage integration (Supabase Storage)
- Download tracking (optional)

**User Personas:**
- Admin (uploads/manages resources)
- Member (views/downloads resources)

**Acceptance Criteria:**
```gherkin
Feature: Resources

  Scenario: Filter resources
    Given resources exist in multiple categories
    When a user selects a category filter
    Then only matching resources appear
    And the filter state persists in URL query params
    And the filter can be cleared

  Scenario: Admin uploads a resource file
    Given an admin is adding a resource
    When they upload a PDF
    Then a resource record is created with a storage_path
    And the file is stored in Supabase Storage
    And the file is accessible via signed URL
    And upload progress is shown during upload

  Scenario: Resource download requires authentication
    Given a resource with is_public = false
    When an unauthenticated user tries to download
    Then they are redirected to login
    And after login, they can download the resource

  Scenario: Resources filter by language
    Given resources exist in English and French
    When a user visits "/fr/programs/the-program/resources"
    Then only French resources are shown by default
    And they can toggle to see all languages
```

---

#### Domain: Prayer Wall
**Related Files:** `features.md` (Section 6), `mvp-prd.md` (Section 4)

**Features:**
- Prayer request submission
- Moderation queue
- Approval/rejection workflow
- Public display of approved requests
- "I prayed" counter increment
- Request categories/tags (optional)

**User Personas:**
- Member (submits requests, views approved requests, clicks "I prayed")
- Moderator/Admin (approves/rejects requests)

**Acceptance Criteria:**
```gherkin
Feature: Prayer Wall

  Scenario: Only approved requests show publicly
    Given there are approved and pending requests
    When a public user visits the prayer wall
    Then only approved requests appear
    And pending requests are not visible
    And the count shows "X prayer requests"

  Scenario: "I prayed" increments counter
    Given an approved prayer request exists
    When a user clicks "I prayed"
    Then prayed_count increases by 1
    And the button shows updated count
    And the user cannot click again (or shows "You prayed")
    And the increment is tracked per user (prevent double-counting)

  Scenario: Submission requires authentication
    Given an unauthenticated user
    When they try to submit a prayer request
    Then they are redirected to login
    And after login, they can submit

  Scenario: Moderator sees moderation queue
    Given a user with role "moderator" or "admin"
    When they visit "/admin/programs/[id]/prayer-requests"
    Then they see pending requests
    And they can approve or reject each request
    And approved requests move to public view
```

---

#### Domain: Budgeting & Finance
**Related Files:** `features.md` (Section 7), `mvp-prd.md` (Section 4)

**Features:**
- Budget event creation
- Expense line items (projected vs actual)
- Revenue tracking (pledges, payments, offerings, other)
- Variance calculations
- Category grouping and totals
- Receipt/contract attachments
- Audit logging for financial changes
- Pledge payment tracking
- Budget event settings

**User Personas:**
- Finance (manages budgets)
- Admin (view-only access)

**Acceptance Criteria:**
```gherkin
Feature: Budgeting

  Scenario: Expenses show variance
    Given a line item has projected 100 and actual 150
    When the page renders
    Then variance shows 50 and over-budget styling (red)
    And the category total includes this variance
    And the summary shows total projected vs actual

  Scenario: Pledge payments update balances
    Given a pledge is 1000 and received is 0
    When a payment of 200 is recorded
    Then received becomes 200 and balance becomes 800
    And the pledge status updates accordingly
    And the revenue summary reflects the payment

  Scenario: Upload receipt links to entity
    Given a finance user uploads a receipt for a line item
    Then the file is stored in Storage
    And an attachment record links to the line item
    And the receipt is viewable/downloadable
    And the attachment shows file name and upload date

  Scenario: Audit logs are created for money changes
    Given audit triggers are enabled
    When actual_amount changes from 10 to 20
    Then an audit log record exists with old_value "10" and new_value "20"
    And the log includes user_id, timestamp, and field_name
    And the log is queryable for reporting

  Scenario: Budget event is organization-scoped
    Given a finance user in Organization A
    When they create a budget event
    Then the event is associated with Organization A
    And users from Organization B cannot see or access it
    And RLS policies enforce this isolation
```

---

## 2. Technical Specifications

### 2.1 Database Schema Design

#### 2.1.1 Core Tables

**organizations**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**users** (extends Supabase Auth)
- Use `auth.users` table
- Create `public.profiles` table for additional user data

**profiles**
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
```

**programs**
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  description_en TEXT,
  description_fr TEXT,
  start_date DATE,
  end_date DATE,
  duration_days INTEGER,
  is_dated BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb, -- {resources: true, prayer_wall: true, events: true}
  branding JSONB DEFAULT '{}'::jsonb, -- {primary_color: "#FF5733", banner_url: "..."}
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, slug)
);

CREATE INDEX idx_programs_org_id ON programs(org_id);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_slug ON programs(slug);
```

**program_days**
```sql
CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL,
  title_en TEXT,
  title_fr TEXT,
  devotional_en TEXT,
  devotional_fr TEXT,
  scriptures_en TEXT[],
  scriptures_fr TEXT[],
  prayer_focus_en TEXT,
  prayer_focus_fr TEXT,
  fasting_focus_en TEXT,
  fasting_focus_fr TEXT,
  activities_en TEXT,
  activities_fr TEXT,
  reflection_questions_en TEXT[],
  reflection_questions_fr TEXT[],
  family_guide_en TEXT,
  family_guide_fr TEXT,
  media_urls TEXT[],
  notes_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, day_index)
);

CREATE INDEX idx_program_days_program_id ON program_days(program_id);
CREATE INDEX idx_program_days_day_index ON program_days(day_index);
```

**user_day_progress**
```sql
CREATE TABLE user_day_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_day_id)
);

CREATE INDEX idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX idx_user_day_progress_program_day_id ON user_day_progress(program_day_id);
```

**speakers**
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

**program_events**
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

**resources**
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

**prayer_requests**
```sql
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  prayed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

CREATE INDEX idx_prayer_requests_program_id ON prayer_requests(program_id);
CREATE INDEX idx_prayer_requests_is_approved ON prayer_requests(is_approved);
CREATE INDEX idx_prayer_requests_user_id ON prayer_requests(user_id);
```

**prayer_prayed_log**
```sql
CREATE TABLE prayer_prayed_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prayer_request_id, user_id)
);

CREATE INDEX idx_prayer_prayed_log_prayer_request_id ON prayer_prayed_log(prayer_request_id);
```

**budget_events**
```sql
CREATE TABLE budget_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_budget_events_org_id ON budget_events(org_id);
CREATE INDEX idx_budget_events_status ON budget_events(status);
```

**budget_line_items**
```sql
CREATE TABLE budget_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_event_id UUID REFERENCES budget_events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  projected_amount DECIMAL(12, 2) DEFAULT 0,
  actual_amount DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_line_items_budget_event_id ON budget_line_items(budget_event_id);
CREATE INDEX idx_budget_line_items_category ON budget_line_items(category);
```

**budget_revenue**
```sql
CREATE TABLE budget_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_event_id UUID REFERENCES budget_events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pledge', 'offering', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  received_amount DECIMAL(12, 2) DEFAULT 0,
  balance DECIMAL(12, 2) GENERATED ALWAYS AS (amount - received_amount) STORED,
  pledger_name TEXT, -- For pledges
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_revenue_budget_event_id ON budget_revenue(budget_event_id);
CREATE INDEX idx_budget_revenue_type ON budget_revenue(type);
```

**budget_attachments**
```sql
CREATE TABLE budget_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_event_id UUID REFERENCES budget_events(id) ON DELETE CASCADE,
  line_item_id UUID REFERENCES budget_line_items(id) ON DELETE SET NULL,
  revenue_id UUID REFERENCES budget_revenue(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  CHECK ((line_item_id IS NOT NULL) OR (revenue_id IS NOT NULL))
);

CREATE INDEX idx_budget_attachments_budget_event_id ON budget_attachments(budget_event_id);
CREATE INDEX idx_budget_attachments_line_item_id ON budget_attachments(line_item_id);
CREATE INDEX idx_budget_attachments_revenue_id ON budget_attachments(revenue_id);
```

**audit_logs**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

#### 2.1.2 RLS Policies Specification

**General RLS Pattern:**
- Enable RLS on all tables
- Policies check organization membership via `org_memberships`
- Admin/Finance roles have broader access
- Members have read-only access to published content

**Example RLS Policies:**

```sql
-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Programs: Public can read published programs
CREATE POLICY "Programs are viewable by everyone if published"
  ON programs FOR SELECT
  USING (status = 'published');

-- Programs: Org members can read all programs in their org
CREATE POLICY "Org members can view all programs in their org"
  ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Programs: Admins can manage programs in their org
CREATE POLICY "Admins can manage programs in their org"
  ON programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('admin')
    )
  );

-- Budget events: Finance and Admin can access
CREATE POLICY "Finance and Admin can access budget events"
  ON budget_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = budget_events.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('finance', 'admin')
    )
  );
```

**RLS Coverage Matrix:**

| Table | Public Read | Member Read | Admin Write | Finance Write |
|-------|------------|-------------|-------------|---------------|
| programs | Published only | All in org | Yes | No |
| program_days | Via program | Via program | Yes | No |
| user_day_progress | Own only | Own only | No | No |
| program_events | Via program | Via program | Yes | No |
| speakers | Via org | Via org | Yes | No |
| resources | Via program | Via program | Yes | No |
| prayer_requests | Approved only | Own + approved | Yes | No |
| budget_events | No | No | View only | Yes |
| budget_line_items | No | No | View only | Yes |
| budget_revenue | No | No | View only | Yes |

#### 2.1.3 Audit Logging Strategy

**Trigger Function for Audit Logs:**
```sql
CREATE OR REPLACE FUNCTION audit_money_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    -- Track changes to money fields
    IF (OLD.projected_amount IS DISTINCT FROM NEW.projected_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'projected_amount', OLD.projected_amount::TEXT, NEW.projected_amount::TEXT, auth.uid());
    END IF;
    
    IF (OLD.actual_amount IS DISTINCT FROM NEW.actual_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'actual_amount', OLD.actual_amount::TEXT, NEW.actual_amount::TEXT, auth.uid());
    END IF;
    
    IF (OLD.amount IS DISTINCT FROM NEW.amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'amount', OLD.amount::TEXT, NEW.amount::TEXT, auth.uid());
    END IF;
    
    IF (OLD.received_amount IS DISTINCT FROM NEW.received_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'received_amount', OLD.received_amount::TEXT, NEW.received_amount::TEXT, auth.uid());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to budget tables
CREATE TRIGGER audit_budget_line_items
  AFTER UPDATE ON budget_line_items
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();

CREATE TRIGGER audit_budget_revenue
  AFTER UPDATE ON budget_revenue
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();
```

#### 2.1.4 Migration File Structure

**Naming Convention:**
- Format: `YYYYMMDDHHMMSS_description.sql`
- Example: `20250127120000_create_core_tables.sql`

**Organization:**
```
supabase/migrations/
  20250127120000_create_core_tables.sql
  20250127120001_create_programs_tables.sql
  20250127120002_create_budgeting_tables.sql
  20250127120003_create_rls_policies.sql
  20250127120004_create_audit_triggers.sql
  20250127120005_create_indexes.sql
  20250127120006_seed_initial_data.sql
```

**Migration Template:**
```sql
-- Migration: YYYYMMDDHHMMSS_description
-- Description: Brief description of what this migration does

BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS table_name (
  -- columns
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column);

-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Create policies (in separate migration or here)
-- CREATE POLICY "policy_name" ON table_name FOR SELECT USING (...);

COMMIT;
```

---

### 2.2 API Contracts

#### 2.2.1 Supabase Client/Server Functions

**Server-Side Helper (lib/supabase/server.ts):**
```typescript
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createServerClient() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        getSession: async () => {
          const accessToken = cookieStore.get('sb-access-token')?.value;
          const refreshToken = cookieStore.get('sb-refresh-token')?.value;
          
          if (!accessToken) return { data: { session: null }, error: null };
          
          // Return session object
          return { data: { session: { access_token: accessToken, refresh_token: refreshToken } }, error: null };
        },
      },
    }
  );
}
```

**Client-Side Helper (lib/supabase/client.ts):**
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### 2.2.2 RPC Functions

**Get Program with Today's Day:**
```sql
CREATE OR REPLACE FUNCTION get_program_with_today(
  p_program_slug TEXT,
  p_org_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS JSON AS $$
DECLARE
  v_program JSON;
  v_today_day JSON;
BEGIN
  -- Get program
  SELECT json_build_object(
    'id', id,
    'slug', slug,
    'title', CASE WHEN p_locale = 'fr' THEN title_fr ELSE title_en END,
    'description', CASE WHEN p_locale = 'fr' THEN description_fr ELSE description_en END,
    'config', config,
    'branding', branding
  ) INTO v_program
  FROM programs
  WHERE slug = p_program_slug AND org_id = p_org_id;
  
  -- Get today's day if dated program
  IF v_program->>'start_date' IS NOT NULL THEN
    SELECT json_build_object(
      'day_index', day_index,
      'title', CASE WHEN p_locale = 'fr' THEN title_fr ELSE title_en END
    ) INTO v_today_day
    FROM program_days
    WHERE program_id = (v_program->>'id')::UUID
    AND day_index = (
      SELECT EXTRACT(DAY FROM CURRENT_DATE - (v_program->>'start_date')::DATE)::INTEGER + 1
    );
  END IF;
  
  RETURN json_build_object(
    'program', v_program,
    'today_day', v_today_day
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Increment Prayer Count:**
```sql
CREATE OR REPLACE FUNCTION increment_prayer_count(
  p_prayer_request_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Check if user already prayed
  IF EXISTS (
    SELECT 1 FROM prayer_prayed_log
    WHERE prayer_request_id = p_prayer_request_id
    AND user_id = auth.uid()
  ) THEN
    RETURN (SELECT prayed_count FROM prayer_requests WHERE id = p_prayer_request_id);
  END IF;
  
  -- Insert log
  INSERT INTO prayer_prayed_log (prayer_request_id, user_id)
  VALUES (p_prayer_request_id, auth.uid())
  ON CONFLICT DO NOTHING;
  
  -- Update count
  UPDATE prayer_requests
  SET prayed_count = prayed_count + 1
  WHERE id = p_prayer_request_id
  RETURNING prayed_count INTO v_count;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2.2.3 Storage Bucket Structure

**Buckets:**
- `resources` - Program resources (PDFs, media)
- `receipts` - Budget receipts/contracts
- `avatars` - User avatars
- `program-banners` - Program banner images

**Storage Policies:**

```sql
-- Resources: Public read, admin write
CREATE POLICY "Resources are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

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

-- Receipts: Finance/Admin only
CREATE POLICY "Finance can access receipts"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'receipts' AND
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('finance', 'admin')
    )
  );
```

---

### 2.3 Frontend Architecture

#### 2.3.1 Component Hierarchy

```
app/
  (public)/
    [lang]/
      page.tsx                    # Programs list
      programs/
        [slug]/
          page.tsx               # Program overview
          days/
            [dayIndex]/
              page.tsx          # Day detail
          events/
            page.tsx            # Events list
            [eventId]/
              page.tsx          # Event detail
          speakers/
            page.tsx            # Speakers list
          resources/
            page.tsx            # Resources library
          prayer-wall/
            page.tsx            # Prayer wall
      profile/
        page.tsx                # User profile
  (admin)/
    admin/
      layout.tsx                # Admin layout with nav
      page.tsx                  # Admin dashboard
      programs/
        page.tsx               # Programs list
        new/
          page.tsx             # Program builder
        [id]/
          page.tsx             # Program settings
          days/
            page.tsx           # Days editor
          events/
            page.tsx           # Events editor
          resources/
            page.tsx           # Resources editor
          prayer-requests/
            page.tsx           # Moderation queue
      budgets/
        page.tsx               # Budgets dashboard
        events/
          new/
            page.tsx           # Create budget event
          [eventId]/
            overview/
              page.tsx         # Budget overview
            expenses/
              page.tsx         # Expenses
            revenue/
              page.tsx         # Revenue
            attachments/
              page.tsx         # Attachments
            settings/
              page.tsx         # Settings
      finance/
        settings/
          page.tsx             # Finance settings

components/
  ui/                          # Base UI components
    button.tsx
    input.tsx
    card.tsx
    dialog.tsx
    etc.
  programs/
    ProgramCard.tsx
    ProgramDayView.tsx
    DayCompletionButton.tsx
    NotesEditor.tsx
  events/
    EventCard.tsx
    EventDetail.tsx
    AddToCalendar.tsx
  resources/
    ResourceCard.tsx
    ResourceFilter.tsx
    ResourceUpload.tsx
  prayer-wall/
    PrayerRequestCard.tsx
    PrayerRequestForm.tsx
    ModerationQueue.tsx
  budgets/
    BudgetEventCard.tsx
    ExpenseLineItem.tsx
    RevenueItem.tsx
    VarianceIndicator.tsx
    ReceiptUpload.tsx
  layout/
    Header.tsx
    Navigation.tsx
    LanguageSwitcher.tsx
```

#### 2.3.2 Server vs Client Components Strategy

**Server Components (Default):**
- All page components (`app/**/page.tsx`)
- Data fetching components
- Static content rendering
- SEO-critical content

**Client Components (`'use client'`):**
- Interactive forms
- Stateful UI (modals, dropdowns)
- Real-time updates
- Browser APIs (localStorage, etc.)

**Example Pattern:**
```typescript
// app/programs/[slug]/page.tsx (Server Component)
import { createServerClient } from '@/lib/supabase/server';
import ProgramOverview from '@/components/programs/ProgramOverview';

export default async function ProgramPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient();
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  return <ProgramOverview program={program} />;
}

// components/programs/ProgramOverview.tsx (Client Component)
'use client';

import { useState } from 'react';
import DayCompletionButton from './DayCompletionButton';

export default function ProgramOverview({ program }) {
  const [completed, setCompleted] = useState(false);
  
  return (
    <div>
      <h1>{program.title}</h1>
      <DayCompletionButton 
        dayId={program.today_day?.id}
        onComplete={() => setCompleted(true)}
      />
    </div>
  );
}
```

#### 2.3.3 State Management Approach

**Server State:**
- Use React Server Components for initial data
- Use Supabase Realtime for live updates (optional)
- Refetch on navigation/mutation

**Client State:**
- React `useState` for UI state (modals, forms)
- React `useFormState` for form state (Next.js 15)
- URL search params for filters/pagination

**Example:**
```typescript
'use client';

import { useFormState } from 'react-dom';
import { updateDayProgress } from '@/app/actions';

export function DayNotesForm({ dayId }: { dayId: string }) {
  const [state, formAction] = useFormState(updateDayProgress, null);
  
  return (
    <form action={formAction}>
      <input type="hidden" name="dayId" value={dayId} />
      <textarea name="notes" defaultValue={state?.notes} />
      <button type="submit">Save Notes</button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

#### 2.3.4 i18n Implementation

**Routing Strategy:**
- Use Next.js App Router with `[lang]` dynamic segment
- Default locale: `en`
- Supported locales: `en`, `fr`

**Dictionary Structure:**
```
lib/i18n/
  dictionaries/
    en.json
    fr.json
  index.ts
```

**Dictionary Example (lib/i18n/dictionaries/en.json):**
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "programs": {
    "title": "Programs",
    "today": "Today",
    "markComplete": "Mark as Completed"
  }
}
```

**Locale Detection:**
```typescript
// lib/i18n/index.ts
import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';

const dictionaries = { en, fr };

export function getDictionary(locale: 'en' | 'fr' = 'en') {
  return dictionaries[locale] || dictionaries.en;
}

// Usage in Server Component
import { getDictionary } from '@/lib/i18n';

export default async function Page({ params }: { params: { lang: string } }) {
  const dict = getDictionary(params.lang as 'en' | 'fr');
  
  return <h1>{dict.programs.title}</h1>;
}
```

#### 2.3.5 Form Handling and Validation

**Server Actions Pattern:**
```typescript
// app/actions/programs.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateDayProgress(
  prevState: any,
  formData: FormData
) {
  const dayId = formData.get('dayId') as string;
  const notes = formData.get('notes') as string;
  
  const supabase = createServerClient();
  const { error } = await supabase
    .from('user_day_progress')
    .upsert({
      program_day_id: dayId,
      notes,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/programs/[slug]/days/[dayIndex]');
  return { success: true };
}
```

**Client-Side Validation:**
```typescript
// Use Zod for schema validation
import { z } from 'zod';

const prayerRequestSchema = z.object({
  content: z.string().min(10).max(1000),
  is_anonymous: z.boolean().default(false),
});

export function PrayerRequestForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = async (formData: FormData) => {
    const data = {
      content: formData.get('content') as string,
      is_anonymous: formData.get('is_anonymous') === 'on',
    };
    
    const result = prayerRequestSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    
    // Submit...
  };
}
```

---

### 2.4 Backend Architecture

#### 2.4.1 RLS Policy Implementation

**Policy Naming Convention:**
- Format: `"[action] [resource] [condition]"`
- Example: `"Admins can manage programs in their org"`

**Policy Types:**
- `SELECT` - Read access
- `INSERT` - Create access
- `UPDATE` - Update access
- `DELETE` - Delete access
- `ALL` - Full CRUD access

**Policy Testing:**
```sql
-- Test RLS policy
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "user-uuid", "role": "member"}';

-- Should return rows
SELECT * FROM programs WHERE org_id = 'org-uuid';

-- Should return empty
SELECT * FROM programs WHERE org_id = 'other-org-uuid';
```

#### 2.4.2 Database Triggers

**Updated At Trigger:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Prayer Count Trigger:**
```sql
CREATE OR REPLACE FUNCTION update_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE prayer_requests
  SET prayed_count = (
    SELECT COUNT(*) FROM prayer_prayed_log
    WHERE prayer_request_id = NEW.prayer_request_id
  )
  WHERE id = NEW.prayer_request_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prayer_count_on_insert
  AFTER INSERT ON prayer_prayed_log
  FOR EACH ROW
  EXECUTE FUNCTION update_prayer_count();
```

---

## 3. UI/UX Requirements

### 3.1 Design System

#### 3.1.1 Color Palette

**Light Mode:**
- Primary: `#FF5733` (configurable per program)
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Text Primary: `#1A1A1A`
- Text Secondary: `#666666`
- Border: `#E0E0E0`
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`

**Dark Mode:**
- Primary: `#FF5733` (same)
- Background: `#000000`
- Surface: `#1A1A1A`
- Text Primary: `#FFFFFF`
- Text Secondary: `#A0A0A0`
- Border: `#333333`
- Success: `#10B981`
- Error: `#EF4444`
- Warning: `#F59E0B`

**Implementation:**
```css
/* globals.css */
:root {
  --primary: #FF5733;
  --background: #FFFFFF;
  --surface: #F5F5F5;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #000000;
    --surface: #1A1A1A;
    --text-primary: #FFFFFF;
    --text-secondary: #A0A0A0;
  }
}
```

#### 3.1.2 Typography Scale

**Font Stack:**
- Primary: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- Monospace: `"SF Mono", Monaco, "Cascadia Code", monospace`

**Scale:**
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)

**Headings:**
- `h1`: `text-4xl font-bold`
- `h2`: `text-3xl font-semibold`
- `h3`: `text-2xl font-semibold`
- `h4`: `text-xl font-medium`

#### 3.1.3 Component Library Structure

**Base Components (components/ui/):**
- `Button` - Primary, secondary, ghost variants
- `Input` - Text, email, password, textarea
- `Card` - Container with padding and shadow
- `Dialog` - Modal overlay
- `Dropdown` - Menu dropdown
- `Badge` - Status indicators
- `Spinner` - Loading indicator
- `Toast` - Notification system

**Feature Components (components/[feature]/):**
- Domain-specific components
- Composed from base components
- Feature-specific logic

#### 3.1.4 Responsive Breakpoints

**Tailwind Defaults:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Mobile-First Approach:**
- Default: Mobile layout
- `md:` - Tablet layout
- `lg:` - Desktop layout

---

### 3.2 User Experience Flows

#### 3.2.1 Navigation Structure

**Public Navigation:**
```
[Logo] Programs | Events | Resources | Prayer Wall | [Language] [Profile]
```

**Admin Navigation:**
```
[Logo] Dashboard | Programs | Budgets | Finance | [Language] [Profile] [Logout]
```

**Mobile Navigation:**
- Hamburger menu
- Slide-out drawer
- Bottom navigation (optional)

#### 3.2.2 Loading States

**Page Loading:**
- Skeleton screens for content areas
- Spinner for initial page load
- Progressive loading (show above-fold first)

**Component Loading:**
- Inline spinner for buttons/actions
- Skeleton for list items
- Shimmer effect for cards

**Example:**
```typescript
export function ProgramList() {
  const { data, isLoading } = usePrograms();
  
  if (isLoading) {
    return <ProgramListSkeleton />;
  }
  
  return (
    <div>
      {data.map(program => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
```

#### 3.2.3 Empty States

**Empty State Components:**
- No programs found
- No events scheduled
- No resources available
- No prayer requests
- No budget events

**Empty State Pattern:**
```typescript
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon name={icon} className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

#### 3.2.4 Error States

**Error Types:**
- Network error (offline, timeout)
- Not found (404)
- Unauthorized (403)
- Server error (500)
- Validation error (form)

**Error Display:**
```typescript
export function ErrorDisplay({ error }: { error: Error }) {
  if (error.message === 'Network request failed') {
    return <OfflineError />;
  }
  
  if (error.status === 404) {
    return <NotFoundError />;
  }
  
  return <GenericError error={error} />;
}
```

#### 3.2.5 Success Feedback

**Success Indicators:**
- Toast notification for actions
- Inline success message for forms
- Checkmark animation
- Success badge/icon

**Toast Example:**
```typescript
import { toast } from 'sonner'; // or similar

export function useSaveDayProgress() {
  const save = async (dayId: string, notes: string) => {
    try {
      await updateDayProgress(dayId, notes);
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };
  
  return { save };
}
```

#### 3.2.6 Form Validation UX

**Validation Timing:**
- On blur (after user leaves field)
- On submit (show all errors)
- Real-time for password strength, etc.

**Error Display:**
- Inline error message below field
- Red border on invalid field
- Error summary at top of form (optional)

**Example:**
```typescript
export function FormField({ name, label, error }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        className={error ? 'border-red-500' : ''}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
```

---

### 3.3 Accessibility

#### 3.3.1 ARIA Labels and Roles

**Required ARIA Attributes:**
- `aria-label` for icon buttons
- `aria-describedby` for form fields with errors
- `aria-live` for dynamic content updates
- `role` for custom components (dialog, menu, etc.)

**Example:**
```typescript
<button
  aria-label="Mark day as completed"
  aria-pressed={isCompleted}
>
  <CheckIcon />
</button>
```

#### 3.3.2 Keyboard Navigation

**Keyboard Support:**
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for dropdowns/selects

**Focus Management:**
- Visible focus indicators
- Focus trap in modals
- Return focus to trigger after modal close

#### 3.3.3 Screen Reader Support

**Semantic HTML:**
- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Use `<nav>`, `<main>`, `<article>`, `<section>`
- Use `<button>` for actions, not `<div>` with onClick

**Alt Text:**
- All images have descriptive alt text
- Decorative images have empty alt text (`alt=""`)

#### 3.3.4 Focus Management

**Focus Trap:**
```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      {children}
    </div>
  );
}
```

---

## 4. Error Handling Requirements

### 4.1 Error Categories

#### 4.1.1 Network Errors

**Types:**
- Offline (no internet connection)
- Timeout (request took too long)
- 500/502/503 (server errors)
- CORS errors

**Handling:**
```typescript
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    if (retries > 0 && error instanceof TypeError) {
      // Network error, retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

**User Feedback:**
- Show "You're offline" banner
- Queue actions for retry when online
- Show retry button for failed requests

#### 4.1.2 Authentication Errors

**Types:**
- Expired session
- Unauthorized (403)
- Invalid credentials
- Session not found

**Handling:**
```typescript
export function withAuth<T>(
  fn: () => Promise<T>
): Promise<T> {
  return fn().catch(async (error) => {
    if (error.status === 401 || error.status === 403) {
      // Redirect to login
      window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      throw error;
    }
    throw error;
  });
}
```

**User Feedback:**
- Redirect to login page
- Show "Session expired" message
- Preserve intended destination

#### 4.1.3 Validation Errors

**Types:**
- Form field validation (client-side)
- Business rule validation (server-side)
- File type/size validation

**Handling:**
```typescript
export function validatePrayerRequest(data: PrayerRequestData) {
  const errors: Record<string, string> = {};
  
  if (!data.content || data.content.length < 10) {
    errors.content = 'Prayer request must be at least 10 characters';
  }
  
  if (data.content.length > 1000) {
    errors.content = 'Prayer request must be less than 1000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

**User Feedback:**
- Show inline errors below fields
- Highlight invalid fields
- Prevent form submission until valid

#### 4.1.4 Permission Errors

**Types:**
- RLS policy violation
- Role-based access denied
- Organization mismatch

**Handling:**
```typescript
export async function checkPermission(
  resource: string,
  action: 'read' | 'write'
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('check_permission', { resource, action });
  
  if (error || !data) {
    return false;
  }
  
  return data;
}
```

**User Feedback:**
- Show "Access denied" message
- Hide/disable unauthorized actions
- Redirect to appropriate page

#### 4.1.5 File Upload Errors

**Types:**
- File too large
- Invalid file type
- Upload timeout
- Storage quota exceeded

**Handling:**
```typescript
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  // Validate file
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // Upload with progress
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  return data.path;
}
```

**User Feedback:**
- Show file size/type requirements
- Show upload progress
- Show error message on failure
- Allow retry

---

### 4.2 Error Handling Strategy

#### 4.2.1 Client-Side Error Boundaries

**Error Boundary Component:**
```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

**Usage:**
```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <ProgramPage />
</ErrorBoundary>
```

#### 4.2.2 Server-Side Error Logging

**Error Logging Service:**
```typescript
export async function logError(
  error: Error,
  context: Record<string, any>
) {
  // Log to Supabase or external service
  await supabase.from('error_logs').insert({
    message: error.message,
    stack: error.stack,
    context: JSON.stringify(context),
    user_id: await getCurrentUserId(),
    timestamp: new Date().toISOString(),
  });
}
```

**Server Action Error Handling:**
```typescript
'use server';

export async function serverAction(
  prevState: any,
  formData: FormData
) {
  try {
    // Action logic
    return { success: true };
  } catch (error) {
    await logError(error as Error, { formData: Object.fromEntries(formData) });
    return { 
      error: 'An error occurred. Please try again.',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    };
  }
}
```

#### 4.2.3 User-Facing Error Messages (i18n)

**Error Messages Dictionary:**
```json
{
  "errors": {
    "network": {
      "offline": "You're offline. Please check your connection.",
      "timeout": "Request timed out. Please try again.",
      "server": "Server error. Please try again later."
    },
    "auth": {
      "expired": "Your session has expired. Please log in again.",
      "unauthorized": "You don't have permission to perform this action."
    },
    "validation": {
      "required": "This field is required",
      "minLength": "Must be at least {min} characters",
      "maxLength": "Must be less than {max} characters"
    },
    "upload": {
      "tooLarge": "File size exceeds {max}MB limit",
      "invalidType": "Invalid file type. Allowed: {types}"
    }
  }
}
```

**Usage:**
```typescript
import { getDictionary } from '@/lib/i18n';

const dict = getDictionary(locale);
const errorMessage = dict.errors.network.offline;
```

#### 4.2.4 Retry Mechanisms

**Retry Hook:**
```typescript
export function useRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
) {
  const [retries, setRetries] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = useCallback(async () => {
    try {
      setError(null);
      const result = await fn();
      setRetries(0);
      return result;
    } catch (err) {
      if (retries < maxRetries) {
        setRetries(r => r + 1);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return execute();
      }
      setError(err as Error);
      throw err;
    }
  }, [fn, retries, maxRetries]);
  
  return { execute, retries, error };
}
```

#### 4.2.5 Fallback UI States

**Fallback Components:**
```typescript
export function ErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </div>
  );
}

export function OfflineFallback() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
      <div className="flex items-center">
        <WifiOff className="w-5 h-5 text-yellow-600 mr-2" />
        <p className="text-yellow-800">
          You're offline. Some features may not be available.
        </p>
      </div>
    </div>
  );
}
```

---

## 5. Database Migration Strategy

### 5.1 Migration File Structure

#### 5.1.1 Naming Convention

**Format:** `YYYYMMDDHHMMSS_description.sql`

**Examples:**
- `20250127120000_create_core_tables.sql`
- `20250127120001_create_programs_tables.sql`
- `20250127120002_create_budgeting_tables.sql`
- `20250127120003_create_rls_policies.sql`
- `20250127120004_create_audit_triggers.sql`
- `20250127120005_create_indexes.sql`
- `20250127120006_seed_initial_data.sql`

#### 5.1.2 Organization by Feature Domain

**Directory Structure:**
```
supabase/migrations/
  20250127120000_001_core/
    20250127120000_create_organizations.sql
    20250127120001_create_profiles.sql
    20250127120002_create_org_memberships.sql
  20250127120010_002_programs/
    20250127120010_create_programs.sql
    20250127120011_create_program_days.sql
    20250127120012_create_user_day_progress.sql
  20250127120020_003_events/
    20250127120020_create_speakers.sql
    20250127120021_create_program_events.sql
  20250127120030_004_resources/
    20250127120030_create_resources.sql
  20250127120040_005_prayer/
    20250127120040_create_prayer_requests.sql
    20250127120041_create_prayer_prayed_log.sql
  20250127120050_006_budgeting/
    20250127120050_create_budget_events.sql
    20250127120051_create_budget_line_items.sql
    20250127120052_create_budget_revenue.sql
    20250127120053_create_budget_attachments.sql
  20250127120060_007_audit/
    20250127120060_create_audit_logs.sql
    20250127120061_create_audit_triggers.sql
  20250127120070_008_rls/
    20250127120070_enable_rls.sql
    20250127120071_create_programs_policies.sql
    20250127120072_create_budgeting_policies.sql
  20250127120080_009_indexes/
    20250127120080_create_programs_indexes.sql
    20250127120081_create_budgeting_indexes.sql
  20250127120090_010_seed/
    20250127120090_seed_initial_data.sql
```

**Alternative: Sequential Approach (Recommended for Supabase):**
```
supabase/migrations/
  20250127120000_create_core_tables.sql
  20250127120001_create_programs_tables.sql
  20250127120002_create_events_tables.sql
  20250127120003_create_resources_tables.sql
  20250127120004_create_prayer_tables.sql
  20250127120005_create_budgeting_tables.sql
  20250127120006_create_audit_tables.sql
  20250127120007_enable_rls.sql
  20250127120008_create_rls_policies.sql
  20250127120009_create_triggers.sql
  20250127120010_create_indexes.sql
  20250127120011_create_rpc_functions.sql
  20250127120012_seed_data.sql
```

#### 5.1.3 Rollback Strategy

**Rollback Migration Format:**
```sql
-- Migration: 20250127120000_create_programs
-- Rollback: 20250127120000_rollback_create_programs.sql

BEGIN;

DROP TABLE IF EXISTS program_days CASCADE;
DROP TABLE IF EXISTS programs CASCADE;

COMMIT;
```

**Rollback Best Practices:**
- Keep rollback migrations for critical changes
- Test rollbacks in staging before production
- Document data loss risks in rollback migrations

---

### 5.2 Migration Content

#### 5.2.1 Table Creation with RLS Policies

**Migration Template:**
```sql
-- Migration: 20250127120000_create_programs
-- Description: Creates programs table with RLS enabled

BEGIN;

-- Create table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  -- ... other columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_programs_org_id ON programs(org_id);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (or in separate migration)
CREATE POLICY "Programs are viewable by everyone if published"
  ON programs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Org members can view all programs in their org"
  ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage programs in their org"
  ON programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );

COMMIT;
```

#### 5.2.2 Index Creation

**Index Strategy:**
- Index foreign keys
- Index frequently queried columns
- Index columns used in WHERE clauses
- Index columns used in ORDER BY
- Composite indexes for multi-column queries

**Example:**
```sql
-- Indexes for program_days
CREATE INDEX IF NOT EXISTS idx_program_days_program_id ON program_days(program_id);
CREATE INDEX IF NOT EXISTS idx_program_days_day_index ON program_days(day_index);
CREATE INDEX IF NOT EXISTS idx_program_days_program_day ON program_days(program_id, day_index);

-- Indexes for user_day_progress
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user_id ON user_day_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_program_day_id ON user_day_progress(program_day_id);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user_program_day ON user_day_progress(user_id, program_day_id);
```

#### 5.2.3 Trigger Functions

**Migration for Triggers:**
```sql
-- Migration: 20250127120004_create_triggers
-- Description: Creates database triggers for updated_at and audit logs

BEGIN;

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_days_updated_at
  BEFORE UPDATE ON program_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ... repeat for other tables

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_money_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.projected_amount IS DISTINCT FROM NEW.projected_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'projected_amount', OLD.projected_amount::TEXT, NEW.projected_amount::TEXT, auth.uid());
    END IF;
    -- ... other fields
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers
CREATE TRIGGER audit_budget_line_items
  AFTER UPDATE ON budget_line_items
  FOR EACH ROW
  EXECUTE FUNCTION audit_money_changes();

COMMIT;
```

#### 5.2.4 Seed Data

**Seed Data Migration:**
```sql
-- Migration: 20250127120012_seed_data
-- Description: Seeds initial data for development/testing

BEGIN;

-- Seed organizations (only in development)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_database WHERE datname = current_database() AND current_database() LIKE '%dev%') THEN
    INSERT INTO organizations (id, name, slug)
    VALUES 
      ('00000000-0000-0000-0000-000000000001', 'Test Church', 'test-church')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Seed categories for resources
INSERT INTO resource_categories (name, display_order)
VALUES 
  ('Devotional', 1),
  ('Scripture', 2),
  ('Teaching', 3),
  ('Music', 4),
  ('Video', 5)
ON CONFLICT DO NOTHING;

-- Seed expense categories for budgets
INSERT INTO expense_categories (name, display_order)
VALUES 
  ('Venue', 1),
  ('Catering', 2),
  ('Transportation', 3),
  ('Materials', 4),
  ('Marketing', 5),
  ('Other', 99)
ON CONFLICT DO NOTHING;

COMMIT;
```

#### 5.2.5 Data Migrations

**Data Migration Example:**
```sql
-- Migration: 20250127120013_migrate_program_dates
-- Description: Migrates undated programs to dated programs

BEGIN;

-- Update programs without dates to have a default start date
UPDATE programs
SET 
  start_date = created_at::DATE,
  end_date = (created_at + (duration_days || ' days')::INTERVAL)::DATE,
  is_dated = true
WHERE is_dated = false AND duration_days IS NOT NULL;

COMMIT;
```

---

### 5.3 Migration Best Practices

#### 5.3.1 Idempotency

**Use IF NOT EXISTS:**
```sql
CREATE TABLE IF NOT EXISTS programs (...);
CREATE INDEX IF NOT EXISTS idx_programs_org_id ON programs(org_id);
```

**Use DO Blocks for Conditional Logic:**
```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'program_status') THEN
    CREATE TYPE program_status AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;
```

#### 5.3.2 Transaction Safety

**Wrap in Transactions:**
```sql
BEGIN;
-- Migration statements
COMMIT;
```

**Handle Errors:**
```sql
BEGIN;
-- Migration statements
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    RAISE;
COMMIT;
```

#### 5.3.3 Testing Migrations

**Test in Development First:**
1. Create migration file
2. Test locally with `supabase db reset`
3. Test rollback if applicable
4. Review SQL for performance implications
5. Apply to staging
6. Apply to production

**Migration Testing Checklist:**
- [ ] Migration runs without errors
- [ ] RLS policies work as expected
- [ ] Indexes are created
- [ ] Triggers fire correctly
- [ ] Data integrity is maintained
- [ ] Rollback works (if applicable)
- [ ] Performance is acceptable

---

## Appendix: Related Documentation

- [MVP PRD](./mvp-prd.md) - Product requirements document
- [Features](./features.md) - Feature specifications and acceptance criteria
- [Overview](./overview.md) - Project overview and tech stack
- [Agentic AI Supabase Flow](./agentic-ai-supabase-flow.md) - AI agent workflow documentation

---

**Document Status:** Complete  
**Next Steps:** Review and implement according to this specification
