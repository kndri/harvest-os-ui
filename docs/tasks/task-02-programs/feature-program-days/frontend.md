# Frontend: Program Days

## Components

### DayContent.tsx
```typescript
'use client';

import { ProgramDay } from '@/types';
import { getLocalizedText } from '@/lib/i18n';

interface DayContentProps {
  day: ProgramDay;
  locale: 'en' | 'fr';
}

export function DayContent({ day, locale }: DayContentProps) {
  const devotional = getLocalizedText(day.devotional_en, day.devotional_fr, locale);
  const scriptures = locale === 'fr' ? day.scriptures_fr : day.scriptures_en;
  
  return (
    <div className="space-y-6">
      {devotional && (
        <section>
          <h2>Devotional</h2>
          <p>{devotional}</p>
        </section>
      )}
      
      {scriptures && scriptures.length > 0 && (
        <section>
          <h2>Scriptures</h2>
          <ul>
            {scriptures.map((verse, i) => (
              <li key={i}>{verse}</li>
            ))}
          </ul>
        </section>
      )}
      
      {/* Other sections... */}
    </div>
  );
}
```

## Pages

### app/[lang]/programs/[slug]/days/[dayIndex]/page.tsx
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { DayContent } from '@/components/programs/DayContent';

export default async function DayPage({
  params,
}: {
  params: { lang: string; slug: string; dayIndex: string };
}) {
  const supabase = createServerClient();
  const dayIndex = parseInt(params.dayIndex);
  
  // Get program first
  const { data: program } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', params.slug)
    .single();
  
  if (!program) notFound();
  
  // Get day
  const { data: day } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', program.id)
    .eq('day_index', dayIndex)
    .single();
  
  if (!day) notFound();
  
  return (
    <div>
      <h1>Day {dayIndex}</h1>
      <DayContent day={day} locale={params.lang as 'en' | 'fr'} />
    </div>
  );
}
```
