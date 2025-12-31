# Acceptance Criteria: Program Days

```gherkin
Feature: Program Days Content Management

  Scenario: Admin can create day content
    Given an admin is on the program days editor
    When they add content for day 1
    And they fill in devotional, scriptures, and prayer focus
    And they click "Save"
    Then the day content is saved
    And it displays on the public day page

  Scenario: Empty sections are hidden
    Given a day has devotional content but no fasting focus
    When the day page renders
    Then the devotional section is visible
    And the fasting focus section is not rendered

  Scenario: Day content is bilingual
    Given a day has devotional_en and devotional_fr
    When a user visits "/fr/programs/test/days/1"
    Then the French devotional displays
    When they switch to English
    Then the English devotional displays

  Scenario: Admin can reorder days
    Given a program has 5 days
    When an admin reorders day 3 to position 1
    Then the day indices are updated
    And the content remains intact
```
