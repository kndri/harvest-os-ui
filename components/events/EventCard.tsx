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
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 transition-all hover:shadow-md hover:border-[#cbd5e1]">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-[#1c1f24] pr-4">{title}</h3>
          {isPast && (
            <span className="text-xs font-medium text-[#64748b] bg-[#f2f4f6] border border-[#e2e8f0] px-3 py-1 rounded-full flex-shrink-0">
              Past
            </span>
          )}
        </div>
        <p className="text-sm text-[#64748b] mb-3 font-medium">
          {format(new Date(event.starts_at), 'MMM d, yyyy h:mm a')}
          {event.ends_at && (
            <> - {format(new Date(event.ends_at), 'h:mm a')}</>
          )}
        </p>
        {event.speaker && (
          <p className="text-sm text-[#64748b] mb-3">
            <span className="font-medium text-[#334e62]">Speaker:</span> <span className="text-[#1c1f24]">{event.speaker.name}</span>
          </p>
        )}
        {description && (
          <p className="text-sm text-[#64748b] mb-3 leading-relaxed line-clamp-3">{description}</p>
        )}
        {event.location && (
          <p className="text-sm text-[#64748b] mt-4 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[#1c1f24]">{event.location}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
