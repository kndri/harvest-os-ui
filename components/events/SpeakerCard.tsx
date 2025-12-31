'use client';

import Link from 'next/link';
import { Speaker } from '@/lib/types';
import { getLocalizedText } from '@/lib/i18n';

interface SpeakerCardProps {
  speaker: Speaker;
  locale: 'en' | 'fr';
  programSlug: string;
}

export function SpeakerCard({ speaker, locale, programSlug }: SpeakerCardProps) {
  const bio = getLocalizedText(speaker.bio_en, speaker.bio_fr, locale);

  return (
    <Link href={`/${locale}/programs/${programSlug}/speakers/${speaker.id}`}>
      <div className="card p-6 rounded-lg border bg-white transition-all hover:shadow-lg">
        <div className="flex items-start gap-4">
          {speaker.photo_url ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={speaker.photo_url}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl text-gray-600">
                {speaker.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {speaker.name}
            </h3>
            {bio && (
              <p className="text-sm text-gray-600 line-clamp-3">{bio}</p>
            )}
            {speaker.email && (
              <p className="text-xs text-gray-500 mt-2">{speaker.email}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
