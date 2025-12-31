# Frontend: Programs Engine

## Components

### ProgramCard.tsx
```typescript
'use client';

import Link from 'next/link';
import { Program } from '@/types';

interface ProgramCardProps {
  program: Program;
  locale: 'en' | 'fr';
}

export function ProgramCard({ program, locale }: ProgramCardProps) {
  const title = locale === 'fr' ? program.title_fr : program.title_en;
  const description = locale === 'fr' ? program.description_fr : program.description_en;
  
  return (
    <Link href={`/${locale}/programs/${program.slug}`}>
      <div className="card">
        <h3>{title}</h3>
        <p>{description}</p>
        {program.branding?.banner_url && (
          <img src={program.branding.banner_url} alt={title} />
        )}
      </div>
    </Link>
  );
}
```

### ProgramForm.tsx
```typescript
'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { createProgram } from '@/app/actions/programs';

export function ProgramForm() {
  const [state, formAction] = useFormState(createProgram, null);
  
  return (
    <form action={formAction}>
      <div>
        <label>English Title</label>
        <input name="title_en" required />
      </div>
      <div>
        <label>French Title</label>
        <input name="title_fr" />
      </div>
      <div>
        <label>Slug</label>
        <input name="slug" required />
      </div>
      <div>
        <label>Modules</label>
        <input type="checkbox" name="config.resources" />
        <input type="checkbox" name="config.prayer_wall" />
        <input type="checkbox" name="config.events" />
      </div>
      <button type="submit">Create Program</button>
    </form>
  );
}
```

## Pages

### app/[lang]/page.tsx (Programs List)
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { ProgramCard } from '@/components/programs/ProgramCard';
import { getDictionary } from '@/lib/i18n';

export default async function ProgramsPage({
  params,
}: {
  params: { lang: string };
}) {
  const supabase = createServerClient();
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  const dict = getDictionary(params.lang as 'en' | 'fr');
  
  return (
    <div>
      <h1>{dict.programs.title}</h1>
      <div className="grid">
        {programs?.map(program => (
          <ProgramCard key={program.id} program={program} locale={params.lang as 'en' | 'fr'} />
        ))}
      </div>
    </div>
  );
}
```

### app/[lang]/programs/[slug]/page.tsx
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProgramOverview } from '@/components/programs/ProgramOverview';

export default async function ProgramPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const supabase = createServerClient();
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  if (!program || program.status !== 'published') {
    notFound();
  }
  
  return <ProgramOverview program={program} locale={params.lang as 'en' | 'fr'} />;
}
```

## Server Actions

### app/actions/programs.ts
```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProgram(
  prevState: any,
  formData: FormData
) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  const { error } = await supabase
    .from('programs')
    .insert({
      title_en: formData.get('title_en') as string,
      title_fr: formData.get('title_fr') as string,
      slug: formData.get('slug') as string,
      org_id: formData.get('org_id') as string,
      config: {
        resources: formData.get('config.resources') === 'on',
        prayer_wall: formData.get('config.prayer_wall') === 'on',
        events: formData.get('config.events') === 'on',
      },
      created_by: user.id,
    });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/admin/programs');
  return { success: true };
}
```
