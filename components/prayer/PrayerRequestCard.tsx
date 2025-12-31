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
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {!request.is_anonymous && request.user_id && (
            <p className="text-xs text-[#64748b] mb-2 font-medium">
              {locale === 'fr' ? 'Par' : 'By'} {request.user_id.slice(0, 8)}...
            </p>
          )}
          {request.is_anonymous && (
            <p className="text-xs text-[#64748b] mb-2 italic font-medium">
              {locale === 'fr' ? 'Anonyme' : 'Anonymous'}
            </p>
          )}
        </div>
        <span className="text-xs text-[#94a3b8] font-medium">
          {format(new Date(request.created_at), 'MMM d, yyyy')}
        </span>
      </div>
      <p className="text-[#1c1f24] mb-6 whitespace-pre-wrap leading-relaxed">{request.content}</p>
      <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
        <button
          onClick={() => !hasPrayed && onPray(request.id)}
          disabled={hasPrayed}
          className={`px-5 py-2.5 rounded-xl transition-all text-sm font-medium ${
            hasPrayed
              ? 'bg-[#f2f4f6] text-[#94a3b8] cursor-not-allowed border border-[#e2e8f0]'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
          }`}
        >
          {hasPrayed
            ? (locale === 'fr' ? '✓ Prié' : '✓ Prayed')
            : (locale === 'fr' ? 'J\'ai prié' : 'I prayed')}
        </button>
        <span className="text-sm text-[#64748b] font-medium">
          {request.prayed_count} {locale === 'fr' ? 'prières' : 'prayers'}
        </span>
      </div>
    </div>
  );
}
