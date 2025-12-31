# Feature Template

Use this template for creating new feature documentation.

## File Structure

Each feature folder should contain:
- `acceptance-criteria.md` - Gherkin format acceptance criteria
- `frontend.md` - Frontend component specifications
- `backend.md` - Backend/database specifications
- `testing.md` - Testing strategies and test cases

## acceptance-criteria.md Template

```markdown
# Acceptance Criteria: [Feature Name]

```gherkin
Feature: [Feature Description]

  Scenario: [Scenario Name]
    Given [precondition]
    When [action]
    Then [expected result]
    And [additional assertion]
```
```

## frontend.md Template

```markdown
# Frontend: [Feature Name]

## Components

### [ComponentName].tsx
\`\`\`typescript
// Component implementation
\`\`\`

## Pages

### app/[route]/page.tsx
\`\`\`typescript
// Page implementation
\`\`\`

## Server Actions

### app/actions/[feature].ts
\`\`\`typescript
// Server action implementation
\`\`\`
```

## backend.md Template

```markdown
# Backend: [Feature Name]

## Database Schema

### [Table Name]
\`\`\`sql
CREATE TABLE [table_name] (
  -- columns
);
\`\`\`

## RLS Policies

\`\`\`sql
-- RLS policy definitions
\`\`\`

## RPC Functions

\`\`\`sql
-- RPC function definitions
\`\`\`

## Migration

\`\`\`sql
-- Migration file content
\`\`\`
```

## testing.md Template

```markdown
# Testing: [Feature Name]

## Unit Tests

\`\`\`typescript
// Unit test examples
\`\`\`

## Integration Tests

\`\`\`typescript
// Integration test examples
\`\`\`

## E2E Tests

\`\`\`typescript
// E2E test examples
\`\`\`

## Manual Testing Checklist

- [ ] Test case 1
- [ ] Test case 2
```

## Content Sources

When creating feature documentation, extract content from:
- `docs/requirements-engineering.md` - Technical specifications
- `docs/features.md` - Feature acceptance criteria
- `docs/mvp-prd.md` - Product requirements
