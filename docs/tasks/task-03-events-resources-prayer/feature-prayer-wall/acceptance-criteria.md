# Acceptance Criteria: Prayer Wall

```gherkin
Feature: Prayer Wall

  Scenario: Only approved requests show publicly
    Given there are approved and pending requests
    When a public user visits the prayer wall
    Then only approved requests appear

  Scenario: "I prayed" increments counter
    Given an approved prayer request exists
    When a user clicks "I prayed"
    Then prayed_count increases by 1
    And the user cannot click again

  Scenario: Submission requires authentication
    Given an unauthenticated user
    When they try to submit a prayer request
    Then they are redirected to login
```
