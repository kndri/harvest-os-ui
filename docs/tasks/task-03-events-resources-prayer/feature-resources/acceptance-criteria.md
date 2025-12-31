# Acceptance Criteria: Resources

```gherkin
Feature: Resources

  Scenario: Filter resources
    Given resources exist in multiple categories
    When a user selects a category filter
    Then only matching resources appear
    And the filter state persists in URL query params

  Scenario: Admin uploads a resource file
    Given an admin is adding a resource
    When they upload a PDF
    Then a resource record is created with a storage_path
    And the file is stored in Supabase Storage
    And upload progress is shown during upload

  Scenario: Resource download requires authentication
    Given a resource with is_public = false
    When an unauthenticated user tries to download
    Then they are redirected to login

  Scenario: Resources filter by language
    Given resources exist in English and French
    When a user visits "/fr/programs/the-program/resources"
    Then only French resources are shown by default
```
