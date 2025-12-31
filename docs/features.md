# FEATURES.md — HarvestOS MVP Development Kickoff
This file is the development starting point: features, page map, and acceptance criteria.

## 0) MVP Page Map
### Public
- `/[lang]` Programs list
- `/[lang]/programs/[slug]` Program overview (today + modules)
- `/[lang]/programs/[slug]/days/[dayIndex]` Day detail
- `/[lang]/programs/[slug]/events` Events list
- `/[lang]/programs/[slug]/events/[eventId]` Event detail
- `/[lang]/programs/[slug]/speakers` Speakers list
- `/[lang]/programs/[slug]/resources` Resources library
- `/[lang]/programs/[slug]/prayer-wall` Prayer wall
- `/[lang]/profile` User profile

### Admin
- `/admin` Dashboard
- `/admin/programs` Programs list
- `/admin/programs/new` Program builder
- `/admin/programs/[id]` Program settings
- `/admin/programs/[id]/days` Days editor
- `/admin/programs/[id]/events` Events editor
- `/admin/programs/[id]/resources` Resources editor
- `/admin/programs/[id]/prayer-requests` Moderation queue

### Budgeting
- `/admin/budgets` Cross-event budgets dashboard
- `/admin/budgets/events/new` Create budget event wizard
- `/admin/budgets/events/[eventId]/overview` Budget overview
- `/admin/budgets/events/[eventId]/expenses` Expenses (proj vs actual)
- `/admin/budgets/events/[eventId]/revenue` Revenue (pledges, offerings, other)
- `/admin/budgets/events/[eventId]/attachments` Receipts/contracts
- `/admin/budgets/events/[eventId]/settings` Budget event settings
- `/admin/finance/settings` Finance settings (categories/types/pledgers)

---

## 1) Feature: Auth + Roles + RLS (MVP)
### Acceptance criteria
```gherkin
Feature: Auth and Role Access

  Scenario: Non-admin cannot access /admin
    Given a signed-in user with role "member"
    When they navigate to "/admin"
    Then they are redirected to "/en"

  Scenario: Finance user can access budgeting routes
    Given a signed-in user with role "FINANCE"
    When they navigate to "/admin/budgets"
    Then the budgets dashboard loads

  Scenario: RLS blocks unauthorized data access
    Given a user who is not in the organization
    When they query budget events for that org
    Then the query returns no rows


2) Feature: Programs Engine (MVP)
Feature: Programs are modular and bilingual

  Scenario: Only enabled modules appear
    Given a program has config.resources = true and config.prayer_wall = false
    When a user visits the program page
    Then the Resources tab is visible
    And the Prayer Wall tab is not visible

  Scenario: Program renders in selected language
    Given a program has title_en and title_fr
    When a user visits "/fr/programs/the-program"
    Then the French title should display


3) Feature: Program Days + Notes + Completion
Feature: Completion and Notes

  Scenario: User marks day complete
    Given a signed-in user is on a program day page
    When they click "Mark as completed"
    Then user_day_progress.completed_at is set

  Scenario: Notes persist
    Given a signed-in user saved notes for day 2
    When they reload the day page
    Then the notes are displayed


    Feature: Events and Speakers

  Scenario: Events list shows upcoming sessions
    Given a program has future events
    When a user visits the events page
    Then events are ordered by starts_at ascending

  Scenario: Speaker is displayed on event detail
    Given an event has a speaker_id
    When a user opens the event detail
    Then the speaker profile is displayed

Feature: Resources

  Scenario: Filter resources
    Given resources exist in multiple categories
    When a user selects a category filter
    Then only matching resources appear

  Scenario: Admin uploads a resource file
    Given an admin is adding a resource
    When they upload a PDF
    Then a resource record is created with a storage_path


Feature: Prayer Wall

  Scenario: Only approved requests show publicly
    Given there are approved and pending requests
    When a public user visits the prayer wall
    Then only approved requests appear

  Scenario: "I prayed" increments counter
    Given an approved prayer request exists
    When a user clicks "I prayed"
    Then prayed_count increases by 1


Feature: Budgeting

  Scenario: Expenses show variance
    Given a line item has projected 100 and actual 150
    When the page renders
    Then variance shows 50 and over-budget styling

  Scenario: Pledge payments update balances
    Given a pledge is 1000 and received is 0
    When a payment of 200 is recorded
    Then received becomes 200 and balance becomes 800

  Scenario: Upload receipt links to entity
    Given a finance user uploads a receipt for a line item
    Then the file is stored in Storage
    And an attachment record links to the line item

  Scenario: Audit logs are created for money changes
    Given audit triggers are enabled
    When actual_amount changes from 10 to 20
    Then an audit log record exists with old_value "10" and new_value "20"
