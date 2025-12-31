# Testing: Events & Speakers

## Integration Tests

```typescript
describe('Events', () => {
  it('should return events ordered by starts_at', async () => {
    const { data } = await supabase
      .from('program_events')
      .select('*')
      .eq('program_id', 'program-id')
      .order('starts_at', { ascending: true });
    
    expect(data?.[0].starts_at < data?.[1].starts_at).toBe(true);
  });
});
```
