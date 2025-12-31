'use client';

import { useState } from 'react';
import { PrayerRequest } from '@/lib/types';
import { PrayerRequestCard } from './PrayerRequestCard';
import { PrayerRequestForm } from './PrayerRequestForm';
import { createClient } from '@/lib/supabase/client';

interface PrayerWallClientProps {
  requests: PrayerRequest[];
  programId: string;
  locale: 'en' | 'fr';
  userId: string | null;
  prayedRequestIds: string[];
}

export function PrayerWallClient({
  requests: initialRequests,
  programId,
  locale,
  userId,
  prayedRequestIds: initialPrayedRequestIds,
}: PrayerWallClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [prayedRequestIds, setPrayedRequestIds] = useState(new Set(initialPrayedRequestIds));
  const [showForm, setShowForm] = useState(false);

  const handlePray = async (requestId: string) => {
    if (!userId) {
      // Redirect to login
      window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('increment_prayer_count', {
        p_prayer_request_id: requestId,
      });

      if (error) throw error;

      // Update local state
      setPrayedRequestIds((prev) => new Set([...prev, requestId]));
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, prayed_count: data || req.prayed_count } : req
        )
      );
    } catch (err) {
      console.error('Error incrementing prayer count:', err);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    // Refresh the page to show new request (if approved)
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1c1f24] mb-4">
              {locale === 'fr' ? 'Mur de prière' : 'Prayer Wall'}
            </h1>
            <p className="text-xl text-[#64748b]">
              {locale === 'fr' ? 'Partagez vos demandes de prière' : 'Share your prayer requests'}
            </p>
          </div>
          {userId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
            >
              {showForm
                ? (locale === 'fr' ? 'Annuler' : 'Cancel')
                : (locale === 'fr' ? 'Soumettre une demande' : 'Submit Request')}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm">
            <PrayerRequestForm
              programId={programId}
              locale={locale}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {requests.length > 0 ? (
          <div className="space-y-6">
            {requests.map((request) => (
              <PrayerRequestCard
                key={request.id}
                request={request}
                onPray={handlePray}
                hasPrayed={prayedRequestIds.has(request.id)}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e2e8f0]">
            <p className="text-[#64748b] font-medium">
              {locale === 'fr'
                ? 'Aucune demande de prière approuvée pour le moment.'
                : 'No approved prayer requests yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
