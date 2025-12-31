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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {locale === 'fr' ? 'Mur de prière' : 'Prayer Wall'}
        </h1>
        {userId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm
              ? (locale === 'fr' ? 'Annuler' : 'Cancel')
              : (locale === 'fr' ? 'Soumettre une demande' : 'Submit Request')}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
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
        <p className="text-gray-600 text-center py-12">
          {locale === 'fr'
            ? 'Aucune demande de prière approuvée pour le moment.'
            : 'No approved prayer requests yet.'}
        </p>
      )}
    </div>
  );
}
