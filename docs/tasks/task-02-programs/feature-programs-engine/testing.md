# Testing: Programs Engine

## Unit Tests

### Program Helpers
```typescript
import { describe, it, expect } from 'vitest';
import { getProgramTitle, getProgramConfig } from '@/lib/programs';

describe('Program Helpers', () => {
  it('should return French title when locale is fr', () => {
    const program = {
      title_en: '21 Day Fast',
      title_fr: 'Jeûne de 21 jours',
    };
    expect(getProgramTitle(program, 'fr')).toBe('Jeûne de 21 jours');
  });
  
  it('should return English title when locale is en', () => {
    const program = {
      title_en: '21 Day Fast',
      title_fr: 'Jeûne de 21 jours',
    };
    expect(getProgramTitle(program, 'en')).toBe('21 Day Fast');
  });
});
```

## Integration Tests

### RLS Policies
```typescript
describe('Programs RLS', () => {
  it('should allow public to read published programs', async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'published');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
  
  it('should prevent public from reading draft programs', async () => {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'draft');
    
    expect(data).toHaveLength(0);
  });
});
```

## E2E Tests

```typescript
test('user can view published program', async ({ page }) => {
  await page.goto('/en/programs/test-program');
  await expect(page.locator('h1')).toContainText('21 Day Fast');
});

test('draft program returns 404 for public', async ({ page }) => {
  const response = await page.goto('/en/programs/draft-program');
  expect(response?.status()).toBe(404);
});
```
