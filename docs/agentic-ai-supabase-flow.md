# Agentic AI Supabase Flow — HarvestOS

**Version:** 1.0  
**Last Updated:** 2025-01-27  
**Related Docs:** [Requirements Engineering](./requirements-engineering.md), [MVP PRD](./mvp-prd.md), [Features](./features.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Autonomous Development Workflow](#2-autonomous-development-workflow)
3. [Autonomous Operations Management](#3-autonomous-operations-management)
4. [AI Agent Workflow Patterns](#4-ai-agent-workflow-patterns)
5. [Tooling & Automation](#5-tooling--automation)
6. [Implementation Examples](#6-implementation-examples)

---

## 1. Overview

This document defines workflows and patterns for an AI agent to autonomously manage Supabase backend development and operations for HarvestOS without human intervention.

### 1.1 Objectives

- **Autonomous Development**: AI agent can generate database schemas, migrations, RLS policies, and API functions from requirements
- **Autonomous Operations**: AI agent can manage migrations, RLS policies, storage, and monitoring
- **Error Recovery**: AI agent can detect, analyze, and fix errors automatically
- **Continuous Improvement**: AI agent can optimize queries, indexes, and performance

### 1.2 Prerequisites

- Access to Supabase project (via CLI or API)
- Read access to requirements documentation
- Write access to migration files
- Ability to execute Supabase CLI commands
- Access to error logs and monitoring

### 1.3 Key Principles

1. **Idempotency**: All operations must be safe to run multiple times
2. **Validation**: Always validate before applying changes
3. **Testing**: Test migrations and policies before production
4. **Rollback**: Always have a rollback strategy
5. **Documentation**: Document all changes and decisions

---

## 2. Autonomous Development Workflow

### 2.1 Requirements → Database Schema

#### 2.1.1 Requirements Analysis

**Input:** Requirements document (e.g., `requirements-engineering.md`)

**Process:**
1. Parse requirements document
2. Extract data model specifications
3. Identify entities, relationships, and constraints
4. Map to database tables and columns
5. Identify required indexes and foreign keys

**Output:** Database schema design (SQL DDL)

**Example Workflow:**
```
Requirements: "Programs have a title in English and French, belong to an organization, and have a status (draft, published, archived)"

Analysis:
- Entity: programs
- Attributes:
  - title_en (TEXT, NOT NULL)
  - title_fr (TEXT, NULLABLE)
  - org_id (UUID, FOREIGN KEY → organizations.id)
  - status (ENUM: 'draft', 'published', 'archived')
- Relationships:
  - Many programs belong to one organization
- Constraints:
  - Unique slug per organization
  - Status must be one of enum values

Schema:
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  ...
  UNIQUE(org_id, slug)
);
```

#### 2.1.2 Schema Generation

**Template-Based Generation:**
```typescript
interface TableSpec {
  name: string;
  columns: ColumnSpec[];
  indexes: IndexSpec[];
  foreignKeys: ForeignKeySpec[];
  constraints: ConstraintSpec[];
}

interface ColumnSpec {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  check?: string;
}

function generateTableSQL(spec: TableSpec): string {
  const columns = spec.columns.map(col => {
    let sql = `${col.name} ${col.type}`;
    if (!col.nullable) sql += ' NOT NULL';
    if (col.defaultValue) sql += ` DEFAULT ${col.defaultValue}`;
    if (col.check) sql += ` CHECK (${col.check})`;
    return sql;
  }).join(',\n  ');
  
  const foreignKeys = spec.foreignKeys.map(fk => 
    `FOREIGN KEY (${fk.column}) REFERENCES ${fk.table}(${fk.referencedColumn}) ON DELETE ${fk.onDelete}`
  ).join(',\n  ');
  
  return `
CREATE TABLE IF NOT EXISTS ${spec.name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ${columns},
  ${foreignKeys},
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
  `.trim();
}
```

**Validation Rules:**
- All tables must have `id` (UUID primary key)
- All tables must have `created_at` and `updated_at` timestamps
- Foreign keys must reference existing tables
- Check constraints must be valid SQL
- Unique constraints must be specified

#### 2.1.3 Migration File Generation

**Migration Generator:**
```typescript
function generateMigration(
  description: string,
  upSQL: string,
  downSQL?: string
): MigrationFile {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+/, '')
    .replace('T', '');
  
  const filename = `${timestamp}_${description.toLowerCase().replace(/\s+/g, '_')}.sql`;
  
  return {
    filename,
    content: `
-- Migration: ${timestamp}_${description}
-- Description: ${description}
-- Generated: ${new Date().toISOString()}

BEGIN;

${upSQL}

COMMIT;
    `.trim(),
    rollback: downSQL ? `
-- Rollback: ${timestamp}_rollback_${description.toLowerCase().replace(/\s+/g, '_')}.sql

BEGIN;

${downSQL}

COMMIT;
    `.trim() : null,
  };
}
```

**Migration Naming Convention:**
- Format: `YYYYMMDDHHMMSS_description.sql`
- Description: Brief, lowercase, underscores
- Examples:
  - `20250127120000_create_programs_table.sql`
  - `20250127120001_add_program_branding_column.sql`
  - `20250127120002_create_program_days_table.sql`

#### 2.1.4 Schema Validation

**Validation Checks:**
1. **Syntax Validation**: SQL syntax is valid
2. **Reference Validation**: All foreign keys reference existing tables
3. **Type Validation**: Column types are valid PostgreSQL types
4. **Constraint Validation**: Check constraints are valid
5. **Index Validation**: Index columns exist

**Validation Function:**
```typescript
async function validateSchema(schema: string): Promise<ValidationResult> {
  const errors: string[] = [];
  
  // Parse SQL
  const ast = parseSQL(schema);
  
  // Check syntax
  if (!ast.valid) {
    errors.push(`SQL syntax error: ${ast.error}`);
  }
  
  // Check foreign keys
  for (const fk of ast.foreignKeys) {
    if (!await tableExists(fk.referencedTable)) {
      errors.push(`Foreign key references non-existent table: ${fk.referencedTable}`);
    }
  }
  
  // Check column types
  for (const table of ast.tables) {
    for (const column of table.columns) {
      if (!isValidPostgresType(column.type)) {
        errors.push(`Invalid type ${column.type} in ${table.name}.${column.name}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

### 2.2 Requirements → RLS Policies

#### 2.2.1 Access Requirements Analysis

**Input:** Requirements document with access control specifications

**Process:**
1. Extract access control requirements per table
2. Identify user roles and permissions
3. Map to RLS policy types (SELECT, INSERT, UPDATE, DELETE)
4. Generate policy conditions based on organization membership and roles

**Output:** RLS policy SQL

**Example:**
```
Requirements: "Admins can manage programs in their organization. Members can view published programs."

Analysis:
- Table: programs
- Policies:
  1. SELECT: Public can read published programs
  2. SELECT: Org members can read all programs in their org
  3. ALL: Admins can manage programs in their org

Policies:
CREATE POLICY "Programs are viewable by everyone if published"
  ON programs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Org members can view all programs in their org"
  ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage programs in their org"
  ON programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = programs.org_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'admin'
    )
  );
```

#### 2.2.2 Policy Generation

**Policy Generator:**
```typescript
interface PolicySpec {
  name: string;
  table: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  condition: string;
  checkCondition?: string; // For INSERT/UPDATE
}

function generateRLSPolicy(spec: PolicySpec): string {
  const operation = spec.operation === 'ALL' 
    ? 'ALL' 
    : `FOR ${spec.operation}`;
  
  const usingClause = spec.condition ? `USING (${spec.condition})` : '';
  const withCheckClause = spec.checkCondition ? `WITH CHECK (${spec.checkCondition})` : '';
  
  return `
CREATE POLICY "${spec.name}"
  ON ${spec.table} ${operation}
  ${usingClause}
  ${withCheckClause};
  `.trim();
}
```

**Common Policy Patterns:**
```typescript
const policyPatterns = {
  // Public read
  publicRead: (table: string, condition: string) => ({
    name: `${table} are publicly readable`,
    table,
    operation: 'SELECT' as const,
    condition,
  }),
  
  // Org member read
  orgMemberRead: (table: string, orgColumn: string) => ({
    name: `Org members can view ${table} in their org`,
    table,
    operation: 'SELECT' as const,
    condition: `
      EXISTS (
        SELECT 1 FROM org_memberships
        WHERE org_memberships.org_id = ${table}.${orgColumn}
        AND org_memberships.user_id = auth.uid()
      )
    `.trim(),
  }),
  
  // Admin manage
  adminManage: (table: string, orgColumn: string) => ({
    name: `Admins can manage ${table} in their org`,
    table,
    operation: 'ALL' as const,
    condition: `
      EXISTS (
        SELECT 1 FROM org_memberships
        WHERE org_memberships.org_id = ${table}.${orgColumn}
        AND org_memberships.user_id = auth.uid()
        AND org_memberships.role = 'admin'
      )
    `.trim(),
  }),
  
  // Own record
  ownRecord: (table: string, userColumn: string) => ({
    name: `Users can manage their own ${table}`,
    table,
    operation: 'ALL' as const,
    condition: `${table}.${userColumn} = auth.uid()`,
  }),
};
```

#### 2.2.3 Policy Testing

**Test Policy Function:**
```typescript
async function testRLSPolicy(
  policyName: string,
  table: string,
  operation: string,
  testUser: { id: string; role: string; orgId: string }
): Promise<TestResult> {
  // Set up test user context
  await supabase.rpc('set_test_user', {
    user_id: testUser.id,
    role: testUser.role,
    org_id: testUser.orgId,
  });
  
  // Attempt operation
  let result;
  switch (operation) {
    case 'SELECT':
      result = await supabase.from(table).select('*');
      break;
    case 'INSERT':
      result = await supabase.from(table).insert({ /* test data */ });
      break;
    case 'UPDATE':
      result = await supabase.from(table).update({ /* updates */ }).eq('id', 'test-id');
      break;
    case 'DELETE':
      result = await supabase.from(table).delete().eq('id', 'test-id');
      break;
  }
  
  // Verify result
  return {
    passed: result.error === null,
    error: result.error?.message,
    data: result.data,
  };
}
```

---

### 2.3 Requirements → API Layer

#### 2.3.1 RPC Function Generation

**Input:** Requirements for complex operations

**Process:**
1. Identify operations that require complex SQL or multiple queries
2. Generate RPC function signatures
3. Implement function logic
4. Add security (SECURITY DEFINER if needed)

**Example:**
```
Requirements: "Get program with today's day for a given program slug"

Analysis:
- Input: program_slug, org_id, locale
- Output: JSON with program and today_day
- Logic:
  1. Get program by slug and org_id
  2. If program is dated, calculate today's day index
  3. Get day content for that index
  4. Return combined JSON

Function:
CREATE OR REPLACE FUNCTION get_program_with_today(
  p_program_slug TEXT,
  p_org_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS JSON AS $$
DECLARE
  v_program JSON;
  v_today_day JSON;
BEGIN
  -- Get program
  SELECT json_build_object(
    'id', id,
    'slug', slug,
    'title', CASE WHEN p_locale = 'fr' THEN title_fr ELSE title_en END,
    ...
  ) INTO v_program
  FROM programs
  WHERE slug = p_program_slug AND org_id = p_org_id;
  
  -- Get today's day if dated
  IF v_program->>'start_date' IS NOT NULL THEN
    SELECT json_build_object(...) INTO v_today_day
    FROM program_days
    WHERE program_id = (v_program->>'id')::UUID
    AND day_index = (
      SELECT EXTRACT(DAY FROM CURRENT_DATE - (v_program->>'start_date')::DATE)::INTEGER + 1
    );
  END IF;
  
  RETURN json_build_object(
    'program', v_program,
    'today_day', v_today_day
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2.3.2 Storage Bucket Configuration

**Bucket Creation:**
```typescript
async function createStorageBucket(
  name: string,
  public: boolean = false
): Promise<void> {
  const { error } = await supabase.storage.createBucket(name, {
    public,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  });
  
  if (error) {
    throw new Error(`Failed to create bucket ${name}: ${error.message}`);
  }
}
```

**Storage Policy Generation:**
```typescript
function generateStoragePolicy(
  bucket: string,
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
  condition: string
): string {
  return `
CREATE POLICY "${bucket} ${operation} policy"
  ON storage.objects FOR ${operation}
  USING (bucket_id = '${bucket}' AND ${condition});
  `.trim();
}
```

---

### 2.4 Requirements → Frontend Components

#### 2.4.1 Component Generation from Data Models

**Input:** Table schema and requirements

**Process:**
1. Analyze table columns
2. Generate form components for CRUD operations
3. Generate list/detail view components
4. Add validation based on column constraints

**Example:**
```
Table: programs
Columns: title_en, title_fr, description_en, description_fr, status, config, branding

Generated Components:
- ProgramForm (create/edit)
- ProgramList (with filters)
- ProgramDetail (read-only)
- ProgramStatusBadge (status display)

Form Fields:
- title_en: TextInput (required, maxLength: 255)
- title_fr: TextInput (optional, maxLength: 255)
- description_en: Textarea (optional)
- description_fr: Textarea (optional)
- status: Select (options: draft, published, archived)
- config: JSONEditor (complex)
- branding: JSONEditor (complex)
```

#### 2.4.2 Page Generation from Routes

**Input:** Route specifications from requirements

**Process:**
1. Parse route structure
2. Generate page component
3. Add data fetching logic
4. Add error handling
5. Add loading states

**Example:**
```
Route: /[lang]/programs/[slug]/days/[dayIndex]

Generated:
- app/[lang]/programs/[slug]/days/[dayIndex]/page.tsx
  - Server component
  - Fetches program day data
  - Handles 404 if day doesn't exist
  - Renders DayDetail component

- components/programs/DayDetail.tsx
  - Client component
  - Displays day content
  - DayCompletionButton
  - NotesEditor
```

---

## 3. Autonomous Operations Management

### 3.1 Migration Management

#### 3.1.1 Automated Migration Creation

**Trigger:** Schema change detected in requirements or code

**Process:**
1. Compare current schema with target schema
2. Generate migration SQL for differences
3. Validate migration
4. Create migration file
5. Test migration locally
6. Apply to staging
7. Apply to production (with approval)

**Migration Diff Algorithm:**
```typescript
interface SchemaDiff {
  tablesToCreate: TableSpec[];
  tablesToModify: TableModification[];
  tablesToDrop: string[];
  indexesToCreate: IndexSpec[];
  indexesToDrop: string[];
}

function diffSchemas(current: Schema, target: Schema): SchemaDiff {
  const diff: SchemaDiff = {
    tablesToCreate: [],
    tablesToModify: [],
    tablesToDrop: [],
    indexesToCreate: [],
    indexesToDrop: [],
  };
  
  // Find new tables
  for (const table of target.tables) {
    if (!current.tables.find(t => t.name === table.name)) {
      diff.tablesToCreate.push(table);
    }
  }
  
  // Find modified tables
  for (const targetTable of target.tables) {
    const currentTable = current.tables.find(t => t.name === targetTable.name);
    if (currentTable) {
      const modifications = diffTable(currentTable, targetTable);
      if (modifications.hasChanges) {
        diff.tablesToModify.push(modifications);
      }
    }
  }
  
  // Find dropped tables
  for (const table of current.tables) {
    if (!target.tables.find(t => t.name === table.name)) {
      diff.tablesToDrop.push(table.name);
    }
  }
  
  return diff;
}
```

#### 3.1.2 Migration Testing

**Test Process:**
1. Create test database
2. Apply migrations up to target
3. Verify schema matches expectations
4. Test RLS policies
5. Test data integrity
6. Test rollback if applicable

**Test Function:**
```typescript
async function testMigration(
  migrationFile: string
): Promise<TestResult> {
  // Create test database
  const testDb = await createTestDatabase();
  
  try {
    // Apply migration
    await applyMigration(testDb, migrationFile);
    
    // Verify schema
    const schema = await getSchema(testDb);
    const expectedSchema = parseMigration(migrationFile);
    const schemaMatch = compareSchemas(schema, expectedSchema);
    
    // Test RLS
    const rlsTests = await testRLSPolicies(testDb);
    
    // Test data integrity
    const integrityTests = await testDataIntegrity(testDb);
    
    return {
      passed: schemaMatch && rlsTests.passed && integrityTests.passed,
      errors: [
        ...schemaMatch.errors,
        ...rlsTests.errors,
        ...integrityTests.errors,
      ],
    };
  } finally {
    await dropTestDatabase(testDb);
  }
}
```

#### 3.1.3 Rollback Procedures

**Rollback Generation:**
```typescript
function generateRollback(upMigration: string): string {
  const ast = parseMigration(upMigration);
  
  const rollbackStatements: string[] = [];
  
  // Reverse CREATE TABLE
  for (const createTable of ast.createTables) {
    rollbackStatements.push(`DROP TABLE IF EXISTS ${createTable.name} CASCADE;`);
  }
  
  // Reverse ALTER TABLE
  for (const alterTable of ast.alterTables) {
    if (alterTable.addColumn) {
      rollbackStatements.push(
        `ALTER TABLE ${alterTable.table} DROP COLUMN IF EXISTS ${alterTable.addColumn.name};`
      );
    }
    if (alterTable.dropColumn) {
      // Recreate column (requires original definition)
      rollbackStatements.push(
        `ALTER TABLE ${alterTable.table} ADD COLUMN ${alterTable.dropColumn.definition};`
      );
    }
  }
  
  // Reverse CREATE INDEX
  for (const createIndex of ast.createIndexes) {
    rollbackStatements.push(`DROP INDEX IF EXISTS ${createIndex.name};`);
  }
  
  return rollbackStatements.join('\n');
}
```

---

### 3.2 RLS Policy Management

#### 3.2.1 Policy Generation from Access Requirements

**Process:**
1. Parse access requirements from documentation
2. Map to RLS policy specifications
3. Generate policy SQL
4. Validate policy syntax
5. Test policy with sample data

**Policy Generator:**
```typescript
interface AccessRequirement {
  table: string;
  role: string;
  operations: ('read' | 'write' | 'delete')[];
  condition: string;
}

function generatePoliciesFromRequirements(
  requirements: AccessRequirement[]
): PolicySpec[] {
  const policies: PolicySpec[] = [];
  
  for (const req of requirements) {
    for (const op of req.operations) {
      policies.push({
        name: `${req.table} ${req.role} ${op}`,
        table: req.table,
        operation: mapOperation(op),
        condition: req.condition,
      });
    }
  }
  
  return policies;
}
```

#### 3.2.2 Policy Testing and Validation

**Test Suite:**
```typescript
interface PolicyTest {
  policyName: string;
  scenarios: TestScenario[];
}

interface TestScenario {
  user: { id: string; role: string; orgId: string };
  operation: string;
  expectedResult: 'allow' | 'deny';
  testData: any;
}

async function testPolicySuite(
  tests: PolicyTest[]
): Promise<TestResults> {
  const results: TestResult[] = [];
  
  for (const test of tests) {
    for (const scenario of test.scenarios) {
      const result = await testRLSPolicy(
        test.policyName,
        scenario.user,
        scenario.operation,
        scenario.testData
      );
      
      results.push({
        ...result,
        expected: scenario.expectedResult,
        passed: result.allowed === (scenario.expectedResult === 'allow'),
      });
    }
  }
  
  return {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed),
  };
}
```

#### 3.2.3 Policy Updates and Migrations

**Policy Update Process:**
1. Detect policy changes
2. Generate migration to drop old policy
3. Generate migration to create new policy
4. Test policy changes
5. Apply migration

**Policy Migration Generator:**
```typescript
function generatePolicyMigration(
  oldPolicy: PolicySpec,
  newPolicy: PolicySpec
): string {
  return `
-- Update policy: ${oldPolicy.name}
BEGIN;

DROP POLICY IF EXISTS "${oldPolicy.name}" ON ${oldPolicy.table};

${generateRLSPolicy(newPolicy)}

COMMIT;
  `.trim();
}
```

---

### 3.3 Storage Management

#### 3.3.1 Bucket Creation and Configuration

**Automated Bucket Setup:**
```typescript
async function setupStorageBuckets(
  buckets: BucketSpec[]
): Promise<void> {
  for (const bucket of buckets) {
    // Check if bucket exists
    const exists = await bucketExists(bucket.name);
    
    if (!exists) {
      await createStorageBucket(bucket.name, bucket.public);
    }
    
    // Configure policies
    for (const policy of bucket.policies) {
      await createStoragePolicy(bucket.name, policy);
    }
  }
}
```

#### 3.3.2 Policy Generation for File Access

**Storage Policy Generator:**
```typescript
function generateStoragePolicies(
  bucket: string,
  requirements: StorageAccessRequirement[]
): string[] {
  const policies: string[] = [];
  
  for (const req of requirements) {
    policies.push(generateStoragePolicy(
      bucket,
      req.operation,
      req.condition
    ));
  }
  
  return policies;
}
```

#### 3.3.3 Cleanup and Maintenance

**Cleanup Process:**
1. Identify orphaned files (no database reference)
2. Identify files exceeding retention period
3. Archive or delete files
4. Update database records

**Cleanup Function:**
```typescript
async function cleanupStorage(
  bucket: string,
  retentionDays: number = 90
): Promise<CleanupResult> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  // Find orphaned files
  const orphanedFiles = await findOrphanedFiles(bucket);
  
  // Find old files
  const oldFiles = await findOldFiles(bucket, cutoffDate);
  
  // Delete files
  const deleted = await deleteFiles(bucket, [...orphanedFiles, ...oldFiles]);
  
  return {
    orphanedFiles: orphanedFiles.length,
    oldFiles: oldFiles.length,
    deleted: deleted.length,
  };
}
```

---

### 3.4 Monitoring & Maintenance

#### 3.4.1 Database Performance Monitoring

**Performance Metrics:**
- Query execution time
- Index usage
- Table sizes
- Connection pool usage
- Slow queries

**Monitoring Function:**
```typescript
async function monitorDatabasePerformance(): Promise<PerformanceReport> {
  const metrics = {
    slowQueries: await getSlowQueries(),
    indexUsage: await getIndexUsage(),
    tableSizes: await getTableSizes(),
    connectionPool: await getConnectionPoolStats(),
  };
  
  // Identify issues
  const issues: Issue[] = [];
  
  if (metrics.slowQueries.length > 0) {
    issues.push({
      type: 'slow_queries',
      severity: 'warning',
      message: `${metrics.slowQueries.length} slow queries detected`,
      recommendations: ['Add indexes', 'Optimize queries'],
    });
  }
  
  return {
    metrics,
    issues,
    timestamp: new Date().toISOString(),
  };
}
```

#### 3.4.2 Query Optimization

**Optimization Process:**
1. Identify slow queries
2. Analyze query plans
3. Suggest index additions
4. Generate migration for indexes
5. Test performance improvement

**Query Analyzer:**
```typescript
async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  const plan = await explainQuery(query);
  
  const analysis: QueryAnalysis = {
    executionTime: plan.executionTime,
    indexesUsed: plan.indexesUsed,
    sequentialScans: plan.sequentialScans,
    recommendations: [],
  };
  
  // Suggest indexes for sequential scans
  for (const scan of plan.sequentialScans) {
    analysis.recommendations.push({
      type: 'add_index',
      table: scan.table,
      columns: scan.columns,
      reason: 'Sequential scan detected',
    });
  }
  
  return analysis;
}
```

#### 3.4.3 Index Management

**Index Analysis:**
```typescript
async function analyzeIndexes(): Promise<IndexAnalysis> {
  const indexes = await getAllIndexes();
  const usage = await getIndexUsage();
  
  const analysis: IndexAnalysis = {
    unused: [],
    missing: [],
    duplicates: [],
  };
  
  // Find unused indexes
  for (const index of indexes) {
    if (!usage.find(u => u.indexName === index.name)) {
      analysis.unused.push(index);
    }
  }
  
  // Find missing indexes (based on query patterns)
  const queryPatterns = await getQueryPatterns();
  for (const pattern of queryPatterns) {
    if (!hasIndexForQuery(pattern)) {
      analysis.missing.push({
        table: pattern.table,
        columns: pattern.columns,
        query: pattern.query,
      });
    }
  }
  
  return analysis;
}
```

---

## 4. AI Agent Workflow Patterns

### 4.1 Iterative Development Pattern

**Workflow:**
```
Requirements Analysis
  ↓
Schema Design
  ↓
Migration Generation
  ↓
RLS Policy Generation
  ↓
API Function Generation
  ↓
Frontend Component Generation
  ↓
Testing
  ↓
Deployment
```

**Implementation:**
```typescript
async function iterativeDevelopment(
  requirements: Requirements
): Promise<DevelopmentResult> {
  // 1. Analyze requirements
  const schema = await analyzeRequirements(requirements);
  
  // 2. Generate migration
  const migration = await generateMigration(schema);
  
  // 3. Test migration
  const migrationTest = await testMigration(migration);
  if (!migrationTest.passed) {
    return { error: 'Migration test failed', details: migrationTest.errors };
  }
  
  // 4. Generate RLS policies
  const policies = await generateRLSPolicies(schema, requirements.access);
  
  // 5. Test policies
  const policyTest = await testRLSPolicies(policies);
  if (!policyTest.passed) {
    return { error: 'Policy test failed', details: policyTest.errors };
  }
  
  // 6. Generate API functions
  const functions = await generateRPCFunctions(requirements.api);
  
  // 7. Generate frontend components
  const components = await generateComponents(schema, requirements.ui);
  
  // 8. Run integration tests
  const integrationTest = await runIntegrationTests();
  if (!integrationTest.passed) {
    return { error: 'Integration test failed', details: integrationTest.errors };
  }
  
  return {
    success: true,
    migration,
    policies,
    functions,
    components,
  };
}
```

---

### 4.2 Error Recovery Pattern

**Workflow:**
```
Error Detection
  ↓
Error Analysis
  ↓
Root Cause Identification
  ↓
Fix Generation
  ↓
Fix Testing
  ↓
Fix Deployment
  ↓
Verification
```

**Implementation:**
```typescript
async function errorRecovery(error: Error): Promise<RecoveryResult> {
  // 1. Detect error
  const errorContext = await getErrorContext(error);
  
  // 2. Analyze error
  const analysis = await analyzeError(error, errorContext);
  
  // 3. Identify root cause
  const rootCause = await identifyRootCause(analysis);
  
  // 4. Generate fix
  const fix = await generateFix(rootCause);
  
  // 5. Test fix
  const fixTest = await testFix(fix);
  if (!fixTest.passed) {
    return {
      success: false,
      error: 'Fix test failed',
      alternativeFixes: await generateAlternativeFixes(rootCause),
    };
  }
  
  // 6. Deploy fix
  await deployFix(fix);
  
  // 7. Verify fix
  const verification = await verifyFix(error);
  
  return {
    success: verification.passed,
    fix,
    verification,
  };
}
```

**Error Types and Fixes:**
```typescript
const errorHandlers = {
  migration_failed: async (error: MigrationError) => {
    // Rollback migration
    await rollbackMigration(error.migration);
    // Analyze failure
    const analysis = await analyzeMigrationFailure(error);
    // Generate corrected migration
    return await generateCorrectedMigration(analysis);
  },
  
  rls_violation: async (error: RLSViolationError) => {
    // Analyze policy
    const policyAnalysis = await analyzePolicy(error.policy);
    // Generate updated policy
    return await generateUpdatedPolicy(policyAnalysis);
  },
  
  query_timeout: async (error: QueryTimeoutError) => {
    // Analyze query
    const queryAnalysis = await analyzeQuery(error.query);
    // Suggest indexes
    const indexes = await suggestIndexes(queryAnalysis);
    // Generate migration for indexes
    return await generateIndexMigration(indexes);
  },
};
```

---

### 4.3 Feature Addition Pattern

**Workflow:**
```
Feature Specification
  ↓
Impact Analysis
  ↓
Schema Changes
  ↓
Migration Generation
  ↓
RLS Updates
  ↓
API Updates
  ↓
Frontend Updates
  ↓
Testing
  ↓
Deployment
```

**Implementation:**
```typescript
async function addFeature(
  featureSpec: FeatureSpec
): Promise<FeatureAdditionResult> {
  // 1. Analyze impact
  const impact = await analyzeImpact(featureSpec);
  
  // 2. Generate schema changes
  const schemaChanges = await generateSchemaChanges(featureSpec);
  
  // 3. Generate migration
  const migration = await generateMigration(schemaChanges);
  
  // 4. Update RLS policies
  const policyUpdates = await generatePolicyUpdates(featureSpec, schemaChanges);
  
  // 5. Update API functions
  const apiUpdates = await generateAPIUpdates(featureSpec);
  
  // 6. Update frontend
  const frontendUpdates = await generateFrontendUpdates(featureSpec);
  
  // 7. Test changes
  const tests = await runFeatureTests(featureSpec);
  if (!tests.passed) {
    return {
      success: false,
      errors: tests.errors,
      rollback: await generateRollback(migration),
    };
  }
  
  // 8. Deploy
  await deployChanges({
    migration,
    policies: policyUpdates,
    api: apiUpdates,
    frontend: frontendUpdates,
  });
  
  return {
    success: true,
    migration,
    changes: {
      schema: schemaChanges,
      policies: policyUpdates,
      api: apiUpdates,
      frontend: frontendUpdates,
    },
  };
}
```

---

## 5. Tooling & Automation

### 5.1 Supabase CLI Integration

#### 5.1.1 Commands for Common Operations

**Migration Commands:**
```bash
# Create new migration
supabase migration new <description>

# Apply migrations
supabase db push

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > types/supabase.ts
```

**RLS Commands:**
```bash
# Test RLS policies
supabase db test

# Generate RLS policies from schema
supabase db diff --schema public
```

**Storage Commands:**
```bash
# List buckets
supabase storage ls

# Create bucket
supabase storage create <bucket-name>

# Set bucket policy
supabase storage policy create <bucket-name> <policy-name>
```

#### 5.1.2 Script Generation Patterns

**Migration Script Generator:**
```typescript
function generateMigrationScript(
  description: string,
  sql: string
): string {
  return `
#!/bin/bash
# Migration: ${description}
# Generated: ${new Date().toISOString()}

set -e

echo "Creating migration: ${description}"
supabase migration new ${description.toLowerCase().replace(/\s+/g, '_')}

echo "Writing migration SQL"
cat > supabase/migrations/*_${description.toLowerCase().replace(/\s+/g, '_')}.sql << 'EOF'
${sql}
EOF

echo "Testing migration"
supabase db reset

echo "Migration created successfully"
  `.trim();
}
```

---

### 5.2 Testing Automation

#### 5.2.1 RLS Policy Testing

**Test Framework:**
```typescript
describe('RLS Policies', () => {
  it('should allow public to read published programs', async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'published');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
  
  it('should prevent non-members from accessing org programs', async () => {
    // Set up test user from different org
    await setTestUser({ orgId: 'other-org' });
    
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('org_id', 'test-org');
    
    expect(data).toHaveLength(0);
  });
});
```

#### 5.2.2 Migration Testing

**Migration Test Suite:**
```typescript
describe('Migrations', () => {
  it('should create programs table', async () => {
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: 'programs',
    });
    
    expect(error).toBeNull();
    expect(data).toBe(true);
  });
  
  it('should have correct columns', async () => {
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: 'programs',
    });
    
    expect(error).toBeNull();
    expect(data).toContainEqual({ name: 'id', type: 'uuid' });
    expect(data).toContainEqual({ name: 'title_en', type: 'text' });
  });
});
```

#### 5.2.3 API Endpoint Testing

**API Test Suite:**
```typescript
describe('RPC Functions', () => {
  it('should get program with today', async () => {
    const { data, error } = await supabase.rpc('get_program_with_today', {
      p_program_slug: 'test-program',
      p_org_id: 'test-org',
      p_locale: 'en',
    });
    
    expect(error).toBeNull();
    expect(data).toHaveProperty('program');
    expect(data).toHaveProperty('today_day');
  });
});
```

---

### 5.3 Validation Checks

#### 5.3.1 Schema Validation

**Validation Function:**
```typescript
async function validateSchema(schema: Schema): Promise<ValidationResult> {
  const checks = [
    validateTableNames(schema),
    validateColumnTypes(schema),
    validateForeignKeys(schema),
    validateConstraints(schema),
    validateIndexes(schema),
  ];
  
  const results = await Promise.all(checks);
  
  return {
    valid: results.every(r => r.valid),
    errors: results.flatMap(r => r.errors),
  };
}
```

#### 5.3.2 RLS Coverage Validation

**Coverage Check:**
```typescript
async function validateRLSCoverage(): Promise<CoverageResult> {
  const tables = await getAllTables();
  const policies = await getAllPolicies();
  
  const coverage: CoverageResult = {
    tables: [],
    missing: [],
  };
  
  for (const table of tables) {
    const tablePolicies = policies.filter(p => p.table === table.name);
    
    const hasSelect = tablePolicies.some(p => p.operation === 'SELECT');
    const hasInsert = tablePolicies.some(p => p.operation === 'INSERT');
    const hasUpdate = tablePolicies.some(p => p.operation === 'UPDATE');
    const hasDelete = tablePolicies.some(p => p.operation === 'DELETE');
    
    coverage.tables.push({
      name: table.name,
      select: hasSelect,
      insert: hasInsert,
      update: hasUpdate,
      delete: hasDelete,
    });
    
    if (!hasSelect) {
      coverage.missing.push({
        table: table.name,
        operation: 'SELECT',
        severity: 'error',
      });
    }
  }
  
  return coverage;
}
```

#### 5.3.3 API Contract Validation

**Contract Validation:**
```typescript
async function validateAPIContracts(): Promise<ContractValidationResult> {
  const functions = await getAllRPCFunctions();
  const contracts = await getAPIContracts();
  
  const results: ContractValidationResult = {
    valid: [],
    invalid: [],
    missing: [],
  };
  
  for (const contract of contracts) {
    const function = functions.find(f => f.name === contract.functionName);
    
    if (!function) {
      results.missing.push(contract);
      continue;
    }
    
    const validation = validateFunctionSignature(function, contract);
    if (validation.valid) {
      results.valid.push(contract);
    } else {
      results.invalid.push({
        contract,
        errors: validation.errors,
      });
    }
  }
  
  return results;
}
```

---

## 6. Implementation Examples

### 6.1 Complete Feature Implementation

**Example: Adding Prayer Request Moderation**

**Step 1: Analyze Requirements**
```
Requirement: "Moderators can approve/reject prayer requests"

Analysis:
- Table: prayer_requests
- New fields: is_approved (boolean), approved_by (UUID), approved_at (timestamp)
- RLS: Moderators can update is_approved
- UI: Moderation queue page
```

**Step 2: Generate Migration**
```sql
-- Migration: 20250127130000_add_prayer_moderation
BEGIN;

ALTER TABLE prayer_requests
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_approved 
  ON prayer_requests(is_approved);

COMMIT;
```

**Step 3: Generate RLS Policies**
```sql
-- Policy: Moderators can approve prayer requests
CREATE POLICY "Moderators can approve prayer requests"
  ON prayer_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = (
        SELECT org_id FROM programs WHERE id = prayer_requests.program_id
      )
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('moderator', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.org_id = (
        SELECT org_id FROM programs WHERE id = prayer_requests.program_id
      )
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('moderator', 'admin')
    )
  );
```

**Step 4: Generate API Function**
```sql
CREATE OR REPLACE FUNCTION approve_prayer_request(
  p_request_id UUID,
  p_approved BOOLEAN
)
RETURNS prayer_requests AS $$
DECLARE
  v_request prayer_requests;
BEGIN
  UPDATE prayer_requests
  SET 
    is_approved = p_approved,
    approved_by = auth.uid(),
    approved_at = CASE WHEN p_approved THEN NOW() ELSE NULL END
  WHERE id = p_request_id
  RETURNING * INTO v_request;
  
  RETURN v_request;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Step 5: Generate Frontend Components**
```typescript
// components/prayer-wall/ModerationQueue.tsx
'use client';

export function ModerationQueue({ programId }: { programId: string }) {
  const { data: requests } = usePrayerRequests({ programId, pending: true });
  
  return (
    <div>
      {requests.map(request => (
        <PrayerRequestCard
          key={request.id}
          request={request}
          actions={
            <>
              <Button onClick={() => approveRequest(request.id)}>Approve</Button>
              <Button onClick={() => rejectRequest(request.id)}>Reject</Button>
            </>
          }
        />
      ))}
    </div>
  );
}
```

**Step 6: Test**
```typescript
describe('Prayer Request Moderation', () => {
  it('should allow moderators to approve requests', async () => {
    await setTestUser({ role: 'moderator' });
    
    const { data, error } = await supabase
      .from('prayer_requests')
      .update({ is_approved: true })
      .eq('id', 'test-request-id')
      .select()
      .single();
    
    expect(error).toBeNull();
    expect(data.is_approved).toBe(true);
    expect(data.approved_by).toBe('test-user-id');
  });
});
```

---

### 6.2 Error Recovery Example

**Scenario: Migration fails due to constraint violation**

**Step 1: Detect Error**
```
Error: "duplicate key value violates unique constraint 'programs_org_id_slug_key'"
Migration: 20250127120000_create_programs_table
```

**Step 2: Analyze Error**
```typescript
const analysis = {
  errorType: 'constraint_violation',
  constraint: 'programs_org_id_slug_key',
  table: 'programs',
  columns: ['org_id', 'slug'],
  reason: 'Duplicate slug within organization',
};
```

**Step 3: Generate Fix**
```sql
-- Fix: Add IF NOT EXISTS or handle duplicates
BEGIN;

-- Check for existing records
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM programs 
    WHERE org_id = NEW.org_id AND slug = NEW.slug
  ) THEN
    RAISE EXCEPTION 'Program with this slug already exists in organization';
  END IF;
END $$;

-- Or use ON CONFLICT
INSERT INTO programs (org_id, slug, title_en, ...)
VALUES (...)
ON CONFLICT (org_id, slug) DO UPDATE
SET title_en = EXCLUDED.title_en, ...;

COMMIT;
```

**Step 4: Test Fix**
```typescript
// Test duplicate handling
const result = await testMigration(fixedMigration);
expect(result.passed).toBe(true);
```

**Step 5: Deploy Fix**
```bash
supabase migration new fix_programs_unique_constraint
# Apply fix
supabase db push
```

---

## Appendix: Related Documentation

- [Requirements Engineering](./requirements-engineering.md) - Complete technical specifications
- [MVP PRD](./mvp-prd.md) - Product requirements document
- [Features](./features.md) - Feature specifications and acceptance criteria
- [Overview](./overview.md) - Project overview and tech stack

---

**Document Status:** Complete  
**Usage:** This document serves as a guide for AI agents to autonomously manage Supabase backend development and operations for HarvestOS.
