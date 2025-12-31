# Acceptance Criteria: Events & Speakers

```gherkin
Feature: Events and Speakers

  Scenario: Events list shows upcoming sessions
    Given a program has future events
    When a user visits the events page
    Then events are ordered by starts_at ascending
    And past events are shown below upcoming events
    And each event shows date, time, and speaker name

  Scenario: Speaker is displayed on event detail
    Given an event has a speaker_id
    When a user opens the event detail
    Then the speaker profile is displayed
    And the speaker's bio and photo are shown
    And clicking the speaker name navigates to speaker detail page

  Scenario: Add to calendar generates ICS file
    Given an event with start_time and end_time
    When a user clicks "Add to Calendar"
    Then an ICS file is generated with correct event details
    And the file downloads automatically

  Scenario: Admin can create event
    Given an admin is on the events editor
    When they create a new event
    And they set title, date, time, and speaker
    Then the event is created
    And it appears in the events list
```
