'use client';

import { useState, useEffect } from 'react';
import { ProgramEvent, Speaker } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface EventFormProps {
  programId: string;
  speakers: Speaker[];
  event?: ProgramEvent;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({
  programId,
  speakers,
  event,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const [titleEn, setTitleEn] = useState(event?.title_en || '');
  const [titleFr, setTitleFr] = useState(event?.title_fr || '');
  const [descriptionEn, setDescriptionEn] = useState(event?.description_en || '');
  const [descriptionFr, setDescriptionFr] = useState(event?.description_fr || '');
  const [startsAt, setStartsAt] = useState(
    event?.starts_at ? new Date(event.starts_at).toISOString().slice(0, 16) : ''
  );
  const [endsAt, setEndsAt] = useState(
    event?.ends_at ? new Date(event.ends_at).toISOString().slice(0, 16) : ''
  );
  const [speakerId, setSpeakerId] = useState(event?.speaker_id || '');
  const [location, setLocation] = useState(event?.location || '');
  const [livestreamUrl, setLivestreamUrl] = useState(event?.livestream_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !startsAt) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const eventData = {
        program_id: programId,
        title_en: titleEn.trim(),
        title_fr: titleFr.trim() || null,
        description_en: descriptionEn.trim() || null,
        description_fr: descriptionFr.trim() || null,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        speaker_id: speakerId || null,
        location: location.trim() || null,
        livestream_url: livestreamUrl.trim() || null,
      };

      if (event) {
        const { error } = await supabase
          .from('program_events')
          .update(eventData)
          .eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('program_events')
          .insert(eventData);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving event:', err);
      alert(err.message || 'Error saving event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-[#1c1f24] mb-6">
        {event ? 'Edit Event' : 'Create Event'}
      </h2>

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Title (English) *
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Title (French)
            </label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Description (English)
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Description (French)
            </label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Starts At *
            </label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Ends At
            </label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#334e62] mb-2">
            Speaker
          </label>
          <select
            value={speakerId}
            onChange={(e) => setSpeakerId(e.target.value)}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          >
            <option value="">None</option>
            {speakers.map((speaker) => (
              <option key={speaker.id} value={speaker.id}>
                {speaker.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Livestream URL
            </label>
            <input
              type="url"
              value={livestreamUrl}
              onChange={(e) => setLivestreamUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6 pt-6 border-t border-[#e2e8f0]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Saving...' : event ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-[#f2f4f6] text-[#334e62] rounded-xl hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0] font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
