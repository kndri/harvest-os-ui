'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ProgramEvent } from '@/lib/types';
import { getLocalizedText } from '@/lib/i18n';

interface EventCardProps {
  event: ProgramEvent;
  locale: 'en' | 'fr';
  programSlug: string;
}

export function EventCard({ event, locale, programSlug }: EventCardProps) {
  const title = getLocalizedText(event.title_en, event.title_fr, locale);
  const description = getLocalizedText(event.description_en, event.description_fr, locale);
  const isPast = new Date(event.starts_at) < new Date();

  return (
    <Link href={`/${locale}/programs/${programSlug}/events/${event.id}`}>
      <div className={`card p-6 rounded-lg border transition-all hover:shadow-lg ${
        isPast ? 'opacity-75 bg-gray-50' : 'bg-white'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {isPast && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              Past
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-3">
          {format(new Date(event.starts_at), 'MMM d, yyyy h:mm a')}
          {event.ends_at && (
            <> - {format(new Date(event.ends_at), 'h:mm a')}</>
          )}
        </p>
        {event.speaker && (
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Speaker:</span> {event.speaker.name}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
        {event.location && (
          <p className="text-xs text-gray-500 mt-2">📍 {event.location}</p>
        )}
      </div>
    </Link>
  );
}
