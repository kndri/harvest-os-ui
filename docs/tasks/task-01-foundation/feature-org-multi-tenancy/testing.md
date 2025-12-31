# Testing: Organization Multi-Tenancy

## Integration Tests

```typescript
describe('Organization Isolation', () => {
  it('should only return programs from user organization', async () => {
    await supabase.auth.signInWithPassword({
      email: 'user@org-a.com',
      password: 'password',
    });

    const { data } = await supabase
      .from('programs')
      .select('*');

    // All programs should belong to org-a
    expect(data?.every(p => p.org_id === 'org-a-id')).toBe(true);
  });
});
```

## E2E Tests

```typescript
test('user can switch organizations', async ({ page }) => {
  await page.goto('/en');
  await page.selectOption('select[name="organization"]', 'org-b-id');
  await expect(page.locator('h1')).toContainText('Organization B');
});
```
