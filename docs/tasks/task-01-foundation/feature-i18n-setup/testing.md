# Testing: i18n Setup

## Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { getLocalizedText, getDictionary } from '@/lib/i18n';

describe('i18n Helpers', () => {
  it('should return French text when locale is fr', () => {
    expect(getLocalizedText('Hello', 'Bonjour', 'fr')).toBe('Bonjour');
  });
  
  it('should return English text when locale is en', () => {
    expect(getLocalizedText('Hello', 'Bonjour', 'en')).toBe('Hello');
  });
  
  it('should fallback to English when French is missing', () => {
    expect(getLocalizedText('Hello', null, 'fr')).toBe('Hello');
  });
  
  it('should return correct dictionary', () => {
    const dict = getDictionary('fr');
    expect(dict.common.save).toBe('Enregistrer');
  });
});
```

## E2E Tests

```typescript
test('language switcher works', async ({ page }) => {
  await page.goto('/en/programs/test');
  await page.click('button:has-text("FR")');
  await expect(page).toHaveURL('/fr/programs/test');
  await expect(page.locator('h1')).toContainText('Jeûne');
});
```
