# Acceptance Criteria: Programs Engine

```gherkin
Feature: Programs are modular and bilingual

  Scenario: Only enabled modules appear
    Given a program has config.resources = true and config.prayer_wall = false
    When a user visits the program page
    Then the Resources tab is visible
    And the Prayer Wall tab is not visible
    And the navigation menu excludes prayer wall

  Scenario: Program renders in selected language
    Given a program has title_en = "21 Day Fast" and title_fr = "Jeûne de 21 jours"
    When a user visits "/fr/programs/the-program"
    Then the French title "Jeûne de 21 jours" displays
    And all program content is in French
    And the language switcher shows "FR" as active

  Scenario: Unpublished program is hidden from public
    Given a program with status = "draft"
    When an unauthenticated user visits "/en/programs/the-program"
    Then they receive a 404 error
    And admin users can still access via "/admin/programs/the-program"

  Scenario: Program branding applies to all pages
    Given a program has branding.primary_color = "#FF5733"
    When a user visits any page under "/en/programs/the-program"
    Then the primary color #FF5733 is used for buttons and accents

  Scenario: Admin can create a new program
    Given an admin user is signed in
    When they navigate to "/admin/programs/new"
    And they fill in the program form
    And they click "Create Program"
    Then a new program is created
    And they are redirected to "/admin/programs/[id]"

  Scenario: Admin can update program settings
    Given an admin user is on the program settings page
    When they update the program title
    And they click "Save"
    Then the program is updated
    And the changes are reflected immediately

  Scenario: Admin can publish a program
    Given a program with status "draft"
    When an admin clicks "Publish"
    Then the program status changes to "published"
    And the program becomes visible to public users

  Scenario: Programs list shows all programs for organization
    Given multiple programs exist in an organization
    When a user visits "/en"
    Then all published programs are displayed
    And programs are ordered by created_at descending
```
