# Backend: Audit Logging

## Database Schema

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
```

## Trigger Function

```sql
CREATE OR REPLACE FUNCTION audit_money_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.projected_amount IS DISTINCT FROM NEW.projected_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'projected_amount', OLD.projected_amount::TEXT, NEW.projected_amount::TEXT, auth.uid());
    END IF;
    
    IF (OLD.actual_amount IS DISTINCT FROM NEW.actual_amount) THEN
      INSERT INTO audit_logs (table_name, record_id, field_name, old_value, new_value, user_id)
      VALUES (TG_TABLE_NAME, NEW.id, 'actual_amount', OLD.actual_amount::TEXT, NEW.actual_amount::TEXT, auth.uid());
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers
CREATE TRIGGER audit_budget_line_items
  AFTER UPDATE ON budget_line_items
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();

CREATE TRIGGER audit_budget_revenue
  AFTER UPDATE ON budget_revenue
  FOR EACH ROW EXECUTE FUNCTION audit_money_changes();
```
