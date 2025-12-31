'use client';

import { useState } from 'react';
import { PrayerRequest } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

interface PrayerModerationClientProps {
  requests: PrayerRequest[];
  programId: string;
}

export function PrayerModerationClient({
  requests: initialRequests,
  programId,
}: PrayerModerationClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('prayer_requests')
        .update({
          is_approved: true,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Error approving request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this prayer request? This action cannot be undone.')) {
      return;
    }

    setProcessingId(requestId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Error rejecting request');
    } finally {
      setProcessingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No pending prayer requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="border rounded-lg p-6 bg-white"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              {request.is_anonymous ? (
                <span className="text-sm text-gray-500 italic">Anonymous</span>
              ) : (
                <span className="text-sm text-gray-500">
                  User: {request.user_id?.slice(0, 8)}...
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          
          <p className="text-gray-800 mb-4 whitespace-pre-wrap">{request.content}</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => handleApprove(request.id)}
              disabled={processingId === request.id}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {processingId === request.id ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={() => handleReject(request.id)}
              disabled={processingId === request.id}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
