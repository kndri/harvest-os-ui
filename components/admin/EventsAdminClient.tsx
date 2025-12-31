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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Events</h1>
          <p className="text-[#64748b]">Manage program events and sessions</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Create Event
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
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
              className="border border-[#e2e8f0] rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1c1f24]">{event.title_en}</h3>
                  {event.title_fr && (
                    <p className="text-sm text-[#64748b] mt-1">{event.title_fr}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-[#f2f4f6] text-[#334e62] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-[#64748b]">
                <p className="font-medium">
                  📅 {format(new Date(event.starts_at), 'MMM d, yyyy h:mm a')}
                  {event.ends_at && (
                    <> - {format(new Date(event.ends_at), 'h:mm a')}</>
                  )}
                </p>
                {event.speaker && (
                  <p>
                    👤 Speaker: <span className="font-medium text-[#334e62]">{event.speaker.name}</span>
                  </p>
                )}
                {event.location && (
                  <p>📍 {event.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium">No events yet.</p>
        </div>
      )}
    </div>
  );
}
