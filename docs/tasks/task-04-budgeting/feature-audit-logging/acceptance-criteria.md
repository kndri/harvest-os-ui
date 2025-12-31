# Acceptance Criteria: Audit Logging

```gherkin
Feature: Audit Logging

  Scenario: Audit logs are created for money changes
    Given audit triggers are enabled
    When actual_amount changes from 10 to 20
    Then an audit log record exists with old_value "10" and new_value "20"
    And the log includes user_id, timestamp, and field_name

  Scenario: Audit logs are queryable
    Given audit logs exist for a budget event
    When a finance user views the audit log
    Then they see all changes with timestamps
    And they can filter by date range
```
