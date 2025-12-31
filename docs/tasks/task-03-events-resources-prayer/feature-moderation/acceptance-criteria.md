# Acceptance Criteria: Prayer Request Moderation

```gherkin
Feature: Prayer Request Moderation

  Scenario: Moderator sees moderation queue
    Given a user with role "moderator" or "admin"
    When they visit "/admin/programs/[id]/prayer-requests"
    Then they see pending requests
    And they can approve or reject each request

  Scenario: Approving request makes it public
    Given a pending prayer request
    When a moderator approves it
    Then is_approved becomes true
    And approved_by is set to moderator's user_id
    And approved_at is set to current timestamp
    And the request appears on the public prayer wall

  Scenario: Rejecting request removes it
    Given a pending prayer request
    When a moderator rejects it
    Then the request is deleted or marked as rejected
    And it does not appear on the public prayer wall
```
