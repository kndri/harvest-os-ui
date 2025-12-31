'use client';

import { ProgramEvent } from '@/lib/types';
import { getLocalizedText } from '@/lib/i18n';

interface AddToCalendarProps {
  event: ProgramEvent;
  locale: 'en' | 'fr';
}

export function AddToCalendar({ event, locale }: AddToCalendarProps) {
  const title = getLocalizedText(event.title_en, event.title_fr, locale);
  const description = getLocalizedText(event.description_en, event.description_fr, locale);

  const generateICS = () => {
    const startDate = formatICSDate(event.starts_at);
    const endDate = event.ends_at ? formatICSDate(event.ends_at) : formatICSDate(
      new Date(new Date(event.starts_at).getTime() + 60 * 60 * 1000).toISOString()
    );

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HarvestOS//Event//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${escapeICS(title)}`,
      description ? `DESCRIPTION:${escapeICS(description)}` : '',
      event.location ? `LOCATION:${escapeICS(event.location)}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');
    
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateICS}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
    >
      {locale === 'fr' ? 'Ajouter au calendrier' : 'Add to Calendar'}
    </button>
  );
}

function formatICSDate(date: string): string {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}
