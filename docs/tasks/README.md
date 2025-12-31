# HarvestOS Tasks & Features

This directory contains all development tasks and features organized by milestone.

## Structure

Each task folder contains feature folders. Each feature folder includes:
- `acceptance-criteria.md` - Gherkin format acceptance criteria
- `frontend.md` - Frontend component specifications and implementation details
- `backend.md` - Backend/database specifications, migrations, RLS policies, API functions
- `testing.md` - Testing strategies, test cases, and verification steps

## Task Organization

### Task 01: Foundation
**Milestone:** Foundation (repo + Supabase + i18n + auth)

- [feature-auth-rbac](./task-01-foundation/feature-auth-rbac/) - Authentication and role-based access control
- [feature-org-multi-tenancy](./task-01-foundation/feature-org-multi-tenancy/) - Organization-based multi-tenancy
- [feature-i18n-setup](./task-01-foundation/feature-i18n-setup/) - Internationalization (EN/FR) setup

### Task 02: Programs
**Milestone:** Programs engine + days + progress/notes

- [feature-programs-engine](./task-02-programs/feature-programs-engine/) - Program CRUD, modular config, bilingual content
- [feature-program-days](./task-02-programs/feature-program-days/) - Day content management
- [feature-day-progress](./task-02-programs/feature-day-progress/) - User completion tracking and notes

### Task 03: Events, Resources & Prayer
**Milestone:** Events + speakers + resources + prayer wall + moderation

- [feature-events-speakers](./task-03-events-resources-prayer/feature-events-speakers/) - Event scheduling and speaker management
- [feature-resources](./task-03-events-resources-prayer/feature-resources/) - Resource library with file uploads
- [feature-prayer-wall](./task-03-events-resources-prayer/feature-prayer-wall/) - Prayer request submission and display
- [feature-moderation](./task-03-events-resources-prayer/feature-moderation/) - Prayer request moderation workflow

### Task 04: Budgeting
**Milestone:** Budgeting MVP (expenses/revenue/attachments/audit)

- [feature-budget-events](./task-04-budgeting/feature-budget-events/) - Budget event creation and management
- [feature-expenses](./task-04-budgeting/feature-expenses/) - Expense line items with projected vs actual
- [feature-revenue](./task-04-budgeting/feature-revenue/) - Revenue tracking (pledges, payments, offerings)
- [feature-attachments](./task-04-budgeting/feature-attachments/) - Receipt and contract attachments
- [feature-audit-logging](./task-04-budgeting/feature-audit-logging/) - Audit logging for financial changes

## Related Documentation

- [Requirements Engineering](../requirements-engineering.md) - Complete technical specifications
- [MVP PRD](../mvp-prd.md) - Product requirements document
- [Features](../features.md) - Feature specifications
- [Overview](../overview.md) - Project overview
- [Agentic AI Supabase Flow](../agentic-ai-supabase-flow.md) - AI agent workflow documentation
