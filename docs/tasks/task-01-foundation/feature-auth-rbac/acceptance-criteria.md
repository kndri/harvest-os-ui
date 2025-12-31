# Acceptance Criteria: Authentication & Role-Based Access Control

## Feature: Auth and Role Access

```gherkin
Feature: Auth and Role Access

  Scenario: Non-admin cannot access /admin
    Given a signed-in user with role "member"
    When they navigate to "/admin"
    Then they are redirected to "/en"
    And they see an error message "Access denied"

  Scenario: Finance user can access budgeting routes
    Given a signed-in user with role "FINANCE"
    When they navigate to "/admin/budgets"
    Then the budgets dashboard loads
    And they can view budget events for their organization

  Scenario: RLS blocks unauthorized data access
    Given a user who is not in the organization
    When they query budget events for that org
    Then the query returns no rows
    And no error is exposed to the user

  Scenario: Unauthenticated user cannot access protected routes
    Given an unauthenticated user
    When they navigate to "/admin"
    Then they are redirected to "/auth/login"
    And the original URL is preserved for redirect after login

  Scenario: User can sign in with email and password
    Given a user exists with email "user@example.com"
    When they navigate to "/auth/login"
    And they enter email "user@example.com"
    And they enter password "password123"
    And they click "Sign In"
    Then they are authenticated
    And they are redirected to their intended destination or "/en"

  Scenario: User can sign out
    Given a signed-in user
    When they click "Sign Out"
    Then their session is terminated
    And they are redirected to "/en"
    And they cannot access protected routes

  Scenario: Session persists across page reloads
    Given a signed-in user
    When they reload the page
    Then they remain authenticated
    And their user data is available

  Scenario: Expired session redirects to login
    Given a user with an expired session
    When they navigate to a protected route
    Then they are redirected to "/auth/login"
    And they see a message "Your session has expired"
```

## User Roles

- **member**: Basic authenticated user, can view published content
- **admin**: Full access to manage programs, events, resources in their organization
- **moderator**: Can moderate prayer requests in their organization
- **finance**: Can manage budgets and financial data in their organization
- **viewer**: Read-only access across organization events

## Access Control Matrix

| Route | Public | Member | Admin | Moderator | Finance | Viewer |
|-------|--------|--------|-------|-----------|---------|--------|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/admin/programs` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/admin/budgets` | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `/admin/programs/[id]/prayer-requests` | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
