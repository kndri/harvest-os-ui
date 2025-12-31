-- Migration: Create Budget Audit Triggers
-- Description: Creates audit trigger function and applies it to budget tables

BEGIN;

-- Audit trigger function for money field changes
CREATE OR REPLACE FUNCTION audit_money_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    -- Track changes to projected_amount
    IF (OLD.projected_amount IS DISTINCT FROM NEW.projected_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'projected_amount', OLD.projected_amount::TEXT, NEW.projected_amount::TEXT, auth.uid());
    END IF;
    
    -- Track changes to actual_amount
    IF (OLD.actual_amount IS DISTINCT FROM NEW.actual_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'actual_amount', OLD.actual_amount::TEXT, NEW.actual_amount::TEXT, auth.uid());
    END IF;
    
    -- Track changes to amount (for revenue)
    IF (OLD.amount IS DISTINCT FROM NEW.amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'amount', OLD.amount::TEXT, NEW.amount::TEXT, auth.uid());
    END IF;
    
    -- Track changes to received_amount (for revenue)
    IF (OLD.received_amount IS DISTINCT FROM NEW.received_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'received_amount', OLD.received_amount::TEXT, NEW.received_amount::TEXT, auth.uid());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist (for idempotency)
DROP TRIGGER IF EXISTS audit_budget_line_items ON budget_line_items;
DROP TRIGGER IF EXISTS audit_budget_revenue ON budget_revenue;

-- Apply triggers to budget_line_items
CREATE TRIGGER audit_budget_line_items
  AFTER UPDATE ON budget_line_items
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();

-- Apply triggers to budget_revenue
CREATE TRIGGER audit_budget_revenue
  AFTER UPDATE ON budget_revenue
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();

COMMIT;
