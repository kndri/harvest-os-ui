# Testing: Program Days

## Integration Tests

```typescript
describe('Program Days', () => {
  it('should return day content for published program', async () => {
    const { data, error } = await supabase
      .from('program_days')
      .select('*')
      .eq('program_id', 'published-program-id')
      .eq('day_index', 1)
      .single();
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.day_index).toBe(1);
  });
});
```

## E2E Tests

```typescript
test('user can view day content', async ({ page }) => {
  await page.goto('/en/programs/test/days/1');
  await expect(page.locator('h1')).toContainText('Day 1');
  await expect(page.locator('section')).toContainText('Devotional');
});
```
