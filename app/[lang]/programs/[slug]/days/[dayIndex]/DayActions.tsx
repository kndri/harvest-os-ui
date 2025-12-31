'use client';

import { useState, useTransition } from 'react';
import { DayContent } from '@/components/programs';
import { markDayComplete, saveDayNotes } from '@/lib/actions/programs';
import { ProgramDay, Locale, UserDayProgress } from '@/types';

interface DayActionsProps {
  day: ProgramDay;
  locale: Locale;
  initialProgress: UserDayProgress | null;
}

export function DayActions({ day, locale, initialProgress }: DayActionsProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [isPending, startTransition] = useTransition();

  const handleMarkComplete = () => {
    startTransition(async () => {
      const result = await markDayComplete(day.id);
      if (result.success && result.data) {
        setProgress(result.data as UserDayProgress);
      }
    });
  };

  const handleSaveNotes = async (notes: string) => {
    const result = await saveDayNotes(day.id, notes);
    if (result.success && result.data) {
      setProgress(result.data as UserDayProgress);
    }
  };

  return (
    <DayContent
      day={day}
      locale={locale}
      progress={progress}
      onMarkComplete={handleMarkComplete}
      onSaveNotes={handleSaveNotes}
      isLoading={isPending}
    />
  );
}
