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
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">
        {event ? 'Edit Event' : 'Create Event'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (English) *
          </label>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Title (French)
          </label>
          <input
            type="text"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (English)
          </label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (French)
          </label>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Starts At *
            </label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ends At
            </label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Speaker
          </label>
          <select
            value={speakerId}
            onChange={(e) => setSpeakerId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">None</option>
            {speakers.map((speaker) => (
              <option key={speaker.id} value={speaker.id}>
                {speaker.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Livestream URL
          </label>
          <input
            type="url"
            value={livestreamUrl}
            onChange={(e) => setLivestreamUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : event ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
