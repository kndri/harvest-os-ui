-- Migration: Create Budget Tables
-- Description: Creates budget_events, budget_line_items, budget_revenue, budget_attachments, and audit_logs tables

BEGIN;

-- Budget Events Table
CREATE TABLE IF NOT EXISTS budget_events (
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

CREATE INDEX IF NOT EXISTS idx_budget_events_org_id ON budget_events(org_id);
CREATE INDEX IF NOT EXISTS idx_budget_events_status ON budget_events(status);

-- Budget Line Items Table (Expenses)
CREATE TABLE IF NOT EXISTS budget_line_items (
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

CREATE INDEX IF NOT EXISTS idx_budget_line_items_budget_event_id ON budget_line_items(budget_event_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_category ON budget_line_items(category);

-- Budget Revenue Table
CREATE TABLE IF NOT EXISTS budget_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_event_id UUID REFERENCES budget_events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pledge', 'offering', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  received_amount DECIMAL(12, 2) DEFAULT 0,
  balance DECIMAL(12, 2) GENERATED ALWAYS AS (amount - received_amount) STORED,
  pledger_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_revenue_budget_event_id ON budget_revenue(budget_event_id);
CREATE INDEX IF NOT EXISTS idx_budget_revenue_type ON budget_revenue(type);

-- Budget Attachments Table
CREATE TABLE IF NOT EXISTS budget_attachments (
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

CREATE INDEX IF NOT EXISTS idx_budget_attachments_budget_event_id ON budget_attachments(budget_event_id);
CREATE INDEX IF NOT EXISTS idx_budget_attachments_line_item_id ON budget_attachments(line_item_id);
CREATE INDEX IF NOT EXISTS idx_budget_attachments_revenue_id ON budget_attachments(revenue_id);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable RLS on all tables
ALTER TABLE budget_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Finance and Admin can access budget events" ON budget_events;
DROP POLICY IF EXISTS "Finance and Admin can access budget line items" ON budget_line_items;
DROP POLICY IF EXISTS "Finance and Admin can access budget revenue" ON budget_revenue;
DROP POLICY IF EXISTS "Finance and Admin can access budget attachments" ON budget_attachments;
DROP POLICY IF EXISTS "Finance and Admin can view audit logs" ON audit_logs;

-- Budget Events RLS: Finance and Admin can access
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

-- Budget Line Items RLS: Finance and Admin can access (via budget_event)
CREATE POLICY "Finance and Admin can access budget line items"
  ON budget_line_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM budget_events be
      JOIN org_memberships om ON om.org_id = be.org_id
      WHERE be.id = budget_line_items.budget_event_id
      AND om.user_id = auth.uid()
      AND om.role IN ('finance', 'admin')
    )
  );

-- Budget Revenue RLS: Finance and Admin can access (via budget_event)
CREATE POLICY "Finance and Admin can access budget revenue"
  ON budget_revenue FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM budget_events be
      JOIN org_memberships om ON om.org_id = be.org_id
      WHERE be.id = budget_revenue.budget_event_id
      AND om.user_id = auth.uid()
      AND om.role IN ('finance', 'admin')
    )
  );

-- Budget Attachments RLS: Finance and Admin can access (via budget_event)
CREATE POLICY "Finance and Admin can access budget attachments"
  ON budget_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM budget_events be
      JOIN org_memberships om ON om.org_id = be.org_id
      WHERE be.id = budget_attachments.budget_event_id
      AND om.user_id = auth.uid()
      AND om.role IN ('finance', 'admin')
    )
  );

-- Audit Logs RLS: Finance and Admin can view (via budget_event)
CREATE POLICY "Finance and Admin can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    -- For budget_line_items
    (table_name = 'budget_line_items' AND EXISTS (
      SELECT 1 FROM budget_line_items bli
      JOIN budget_events be ON be.id = bli.budget_event_id
      JOIN org_memberships om ON om.org_id = be.org_id
      WHERE bli.id = audit_logs.record_id
      AND om.user_id = auth.uid()
      AND om.role IN ('finance', 'admin')
    ))
    OR
    -- For budget_revenue
    (table_name = 'budget_revenue' AND EXISTS (
      SELECT 1 FROM budget_revenue br
      JOIN budget_events be ON be.id = br.budget_event_id
      JOIN org_memberships om ON om.org_id = be.org_id
      WHERE br.id = audit_logs.record_id
      AND om.user_id = auth.uid()
      AND om.role IN ('finance', 'admin')
    ))
  );

COMMIT;
