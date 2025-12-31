# Frontend: Day Progress

## Components

### DayCompletionButton.tsx
```typescript
'use client';

import { useState } from 'react';
import { markDayComplete } from '@/app/actions/progress';

interface DayCompletionButtonProps {
  dayId: string;
  isCompleted: boolean;
}

export function DayCompletionButton({ dayId, isCompleted }: DayCompletionButtonProps) {
  const [completed, setCompleted] = useState(isCompleted);

  const handleClick = async () => {
    await markDayComplete(dayId);
    setCompleted(true);
  };

  return (
    <button
      onClick={handleClick}
      disabled={completed}
      className={completed ? 'completed' : ''}
    >
      {completed ? '✓ Completed' : 'Mark as Completed'}
    </button>
  );
}
```

### NotesEditor.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { saveDayNotes } from '@/app/actions/progress';

interface NotesEditorProps {
  dayId: string;
  initialNotes: string;
}

export function NotesEditor({ dayId, initialNotes }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  const debouncedSave = useDebouncedCallback(async (value: string) => {
    setSaving(true);
    await saveDayNotes(dayId, value);
    setSaving(false);
  }, 2000);

  useEffect(() => {
    if (notes !== initialNotes) {
      debouncedSave(notes);
    }
  }, [notes, debouncedSave, initialNotes]);

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes..."
        className="w-full min-h-[200px]"
      />
      {saving && <span className="text-sm text-gray-500">Saving...</span>}
    </div>
  );
}
```

## Server Actions

### app/actions/progress.ts
```typescript
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markDayComplete(dayId: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  const { error } = await supabase
    .from('user_day_progress')
    .upsert({
      program_day_id: dayId,
      user_id: user.id,
      completed_at: new Date().toISOString(),
    });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/programs/[slug]/days/[dayIndex]');
  return { success: true };
}

export async function saveDayNotes(dayId: string, notes: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  const { error } = await supabase
    .from('user_day_progress')
    .upsert({
      program_day_id: dayId,
      user_id: user.id,
      notes,
    });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}
```
