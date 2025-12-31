# Acceptance Criteria: Organization Multi-Tenancy

```gherkin
Feature: Organization Multi-Tenancy

  Scenario: User belongs to multiple organizations
    Given a user exists
    When they are added to Organization A with role "admin"
    And they are added to Organization B with role "member"
    Then they can access both organizations
    And their role is different in each organization

  Scenario: Data is isolated by organization
    Given Organization A has programs
    And Organization B has programs
    When a user from Organization A queries programs
    Then only Organization A programs are returned
    And Organization B programs are not visible

  Scenario: RLS enforces organization isolation
    Given a user from Organization A
    When they try to query budget events from Organization B
    Then the query returns no rows
    And no error information is exposed

  Scenario: Admin can manage organization members
    Given an admin user in Organization A
    When they add a new member to Organization A
    Then the member is added with the specified role
    And the member can access Organization A resources
```
