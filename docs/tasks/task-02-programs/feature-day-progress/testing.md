# Testing: Day Progress

## Integration Tests

```typescript
describe('Day Progress', () => {
  it('should mark day as complete', async () => {
    await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password',
    });

    const { error } = await supabase
      .from('user_day_progress')
      .upsert({
        program_day_id: 'day-1-id',
        user_id: 'user-id',
        completed_at: new Date().toISOString(),
      });

    expect(error).toBeNull();
  });
});
```

## E2E Tests

```typescript
test('user can mark day as complete', async ({ page }) => {
  await page.goto('/en/programs/test/days/1');
  await page.click('button:has-text("Mark as Completed")');
  await expect(page.locator('button')).toContainText('Completed');
});
```
