'use client';

import { PrayerRequest } from '@/lib/types';
import { format } from 'date-fns';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onPray: (id: string) => Promise<void>;
  hasPrayed: boolean;
  locale: 'en' | 'fr';
}

export function PrayerRequestCard({ request, onPray, hasPrayed, locale }: PrayerRequestCardProps) {
  return (
    <div className="card p-6 rounded-lg border bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {!request.is_anonymous && request.user_id && (
            <p className="text-xs text-gray-500 mb-2">
              {locale === 'fr' ? 'Par' : 'By'} {request.user_id.slice(0, 8)}...
            </p>
          )}
          {request.is_anonymous && (
            <p className="text-xs text-gray-500 mb-2 italic">
              {locale === 'fr' ? 'Anonyme' : 'Anonymous'}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {format(new Date(request.created_at), 'MMM d, yyyy')}
        </span>
      </div>
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{request.content}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => !hasPrayed && onPray(request.id)}
          disabled={hasPrayed}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            hasPrayed
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {hasPrayed
            ? (locale === 'fr' ? '✓ Prié' : '✓ Prayed')
            : (locale === 'fr' ? 'J\'ai prié' : 'I prayed')}
        </button>
        <span className="text-sm text-gray-600">
          {request.prayed_count} {locale === 'fr' ? 'prières' : 'prayers'}
        </span>
      </div>
    </div>
  );
}
