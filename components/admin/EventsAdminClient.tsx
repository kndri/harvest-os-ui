'use client';

import { useState } from 'react';
import { ProgramEvent, Speaker } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { EventForm } from './EventForm';

interface EventsAdminClientProps {
  events: ProgramEvent[];
  speakers: Speaker[];
  programId: string;
}

export function EventsAdminClient({
  events: initialEvents,
  speakers,
  programId,
}: EventsAdminClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ProgramEvent | null>(null);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('program_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Error deleting event');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Event
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <EventForm
            programId={programId}
            speakers={speakers}
            event={editingEvent || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        </div>
      )}

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-6 bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.title_en}</h3>
                  {event.title_fr && (
                    <p className="text-sm text-gray-600">{event.title_fr}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {format(new Date(event.starts_at), 'MMM d, yyyy h:mm a')}
                {event.ends_at && (
                  <> - {format(new Date(event.ends_at), 'h:mm a')}</>
                )}
              </p>
              {event.speaker && (
                <p className="text-sm text-gray-600">
                  Speaker: {event.speaker.name}
                </p>
              )}
              {event.location && (
                <p className="text-sm text-gray-600">📍 {event.location}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-12">No events yet.</p>
      )}
    </div>
  );
}
