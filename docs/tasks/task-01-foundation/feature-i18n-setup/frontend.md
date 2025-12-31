# Frontend: i18n Setup

## Dictionary Structure

**lib/i18n/dictionaries/en.json**
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "loading": "Loading...",
    "error": "Error"
  },
  "programs": {
    "title": "Programs",
    "today": "Today",
    "markComplete": "Mark as Completed",
    "viewProgram": "View Program"
  },
  "auth": {
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "email": "Email",
    "password": "Password"
  }
}
```

**lib/i18n/dictionaries/fr.json**
```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "loading": "Chargement...",
    "error": "Erreur"
  },
  "programs": {
    "title": "Programmes",
    "today": "Aujourd'hui",
    "markComplete": "Marquer comme terminé",
    "viewProgram": "Voir le programme"
  },
  "auth": {
    "signIn": "Se connecter",
    "signOut": "Se déconnecter",
    "email": "Courriel",
    "password": "Mot de passe"
  }
}
```

## Helper Functions

**lib/i18n/index.ts**
```typescript
import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';

const dictionaries = { en, fr };

export function getDictionary(locale: 'en' | 'fr' = 'en') {
  return dictionaries[locale] || dictionaries.en;
}

export function getLocalizedText(
  enText: string | null,
  frText: string | null,
  locale: 'en' | 'fr' = 'en'
): string {
  if (locale === 'fr' && frText) {
    return frText;
  }
  return enText || '';
}
```

## Components

### LanguageSwitcher.tsx
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function LanguageSwitcher({ currentLocale }: { currentLocale: 'en' | 'fr' }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLanguage = (newLocale: 'en' | 'fr') => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('en')}
        className={currentLocale === 'en' ? 'font-bold' : ''}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('fr')}
        className={currentLocale === 'fr' ? 'font-bold' : ''}
      >
        FR
      </button>
    </div>
  );
}
```

## Middleware

**middleware.ts** (add locale handling)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname starts with a locale
  const pathnameHasLocale = /^\/(en|fr)(\/|$)/.test(pathname);
  
  if (!pathnameHasLocale) {
    // Redirect to default locale (en)
    const locale = 'en';
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Usage in Pages

```typescript
import { getDictionary } from '@/lib/i18n';
import { getLocalizedText } from '@/lib/i18n';

export default async function ProgramPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const locale = params.lang as 'en' | 'fr';
  const dict = getDictionary(locale);
  
  const program = await getProgram(params.slug);
  const title = getLocalizedText(program.title_en, program.title_fr, locale);
  
  return (
    <div>
      <h1>{title}</h1>
      <p>{dict.programs.today}</p>
    </div>
  );
}
```
