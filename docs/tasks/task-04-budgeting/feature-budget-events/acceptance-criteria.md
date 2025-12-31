# Acceptance Criteria: Budget Events

```gherkin
Feature: Budget Events

  Scenario: Finance user can create budget event
    Given a finance user is signed in
    When they navigate to "/admin/budgets/events/new"
    And they fill in event name and dates
    Then a budget event is created
    And they are redirected to the event overview

  Scenario: Budget event is organization-scoped
    Given a finance user in Organization A
    When they create a budget event
    Then the event is associated with Organization A
    And users from Organization B cannot see it

  Scenario: Budget event has status
    Given a budget event
    When it is created
    Then status is "draft"
    When finance user activates it
    Then status becomes "active"
```
