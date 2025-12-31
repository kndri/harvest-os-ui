# Acceptance Criteria: i18n Setup

```gherkin
Feature: Internationalization (EN/FR)

  Scenario: Language is detected from URL
    Given a user visits "/fr/programs/test-program"
    Then all content displays in French
    And the language switcher shows "FR" as active

  Scenario: Language switcher changes language
    Given a user is on "/en/programs/test-program"
    When they click the language switcher to "FR"
    Then they are redirected to "/fr/programs/test-program"
    And all content displays in French

  Scenario: Default language is English
    Given a user visits "/programs/test-program" (no lang prefix)
    Then they are redirected to "/en/programs/test-program"
    And content displays in English

  Scenario: Bilingual content displays correctly
    Given a program has title_en = "21 Day Fast" and title_fr = "Jeûne de 21 jours"
    When a user visits "/fr/programs/test-program"
    Then the French title "Jeûne de 21 jours" displays
    When they switch to English
    Then the English title "21 Day Fast" displays

  Scenario: Missing translation falls back to English
    Given a program has title_en = "Test" but no title_fr
    When a user visits "/fr/programs/test-program"
    Then the English title "Test" displays as fallback
```
