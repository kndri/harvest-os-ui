# Acceptance Criteria: Expenses

```gherkin
Feature: Budget Expenses

  Scenario: Expenses show variance
    Given a line item has projected 100 and actual 150
    When the page renders
    Then variance shows 50 and over-budget styling (red)
    And the category total includes this variance

  Scenario: Finance user can add expense line item
    Given a finance user is on the expenses page
    When they add a new line item
    And they set category, description, and projected amount
    Then the line item is created
    And it appears in the expenses list

  Scenario: Expenses grouped by category
    Given multiple expense line items in different categories
    When the expenses page renders
    Then expenses are grouped by category
    And each category shows a subtotal
```
