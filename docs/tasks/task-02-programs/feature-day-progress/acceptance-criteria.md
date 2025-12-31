# Acceptance Criteria: Day Progress

```gherkin
Feature: Day Completion and Notes

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

  Scenario: Today detection works for date-based programs
    Given a program with start_date = "2025-01-01" and duration = 21 days
    And today is "2025-01-15"
    When a user visits the program page
    Then day 15 is highlighted as "Today"
    And the "Today" link navigates to "/en/programs/the-program/days/15"

  Scenario: User can view progress summary
    Given a user has completed 5 out of 21 days
    When they visit their profile
    Then they see "5/21 days completed"
    And a progress bar shows completion percentage
```
