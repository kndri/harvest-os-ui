'use client';

import { useState } from 'react';
import { Speaker } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { SpeakerForm } from './SpeakerForm';

interface SpeakersAdminClientProps {
  speakers: Speaker[];
  orgId: string;
}

export function SpeakersAdminClient({
  speakers: initialSpeakers,
  orgId,
}: SpeakersAdminClientProps) {
  const [speakers, setSpeakers] = useState(initialSpeakers);
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  const handleDelete = async (speakerId: string) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('speakers')
        .delete()
        .eq('id', speakerId);

      if (error) throw error;

      setSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
    } catch (err) {
      console.error('Error deleting speaker:', err);
      alert('Error deleting speaker');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSpeaker(null);
    window.location.reload();
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingSpeaker(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Create Speaker
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
          <SpeakerForm
            orgId={orgId}
            speaker={editingSpeaker || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingSpeaker(null);
            }}
          />
        </div>
      )}

      {speakers.length > 0 ? (
        <div className="space-y-4">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="border border-[#e2e8f0] rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-4 flex-1">
                  {speaker.photo_url && (
                    <img
                      src={speaker.photo_url}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#e2e8f0]"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1c1f24]">{speaker.name}</h3>
                    {speaker.bio_en && (
                      <p className="text-sm text-[#64748b] mt-2 line-clamp-2">
                        {speaker.bio_en}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-[#64748b]">
                      {speaker.email && (
                        <span>📧 {speaker.email}</span>
                      )}
                      {speaker.website && (
                        <a
                          href={speaker.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingSpeaker(speaker);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-[#f2f4f6] text-[#334e62] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(speaker.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium">No speakers yet.</p>
        </div>
      )}
    </>
  );
}
