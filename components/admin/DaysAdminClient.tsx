'use client';

import { useState } from 'react';
import { ProgramDay } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface DaysAdminClientProps {
  days: ProgramDay[];
  programId: string;
  programSlug: string;
  programTitle: string;
  durationDays: number | null;
}

export function DaysAdminClient({
  days: initialDays,
  programId,
  programSlug,
  programTitle,
  durationDays,
}: DaysAdminClientProps) {
  const [days, setDays] = useState(initialDays);

  const handleDelete = async (dayId: string) => {
    if (!confirm('Are you sure you want to delete this day?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('program_days')
        .delete()
        .eq('id', dayId);

      if (error) throw error;

      setDays((prev) => prev.filter((d) => d.id !== dayId));
    } catch (err) {
      console.error('Error deleting day:', err);
      alert('Error deleting day');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Program Days</h1>
          <p className="text-[#64748b]">{programTitle}</p>
        </div>
        <Link
          href={`/admin/programs/${programId}`}
          className="px-4 py-2 bg-[#f2f4f6] text-[#334e62] rounded-xl hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
        >
          ← Back to Program
        </Link>
      </div>

      {durationDays && days.length < durationDays && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <p className="font-medium">
            Program has {durationDays} days configured, but only {days.length} day(s) created.
            Create days via the public day pages or add them manually.
          </p>
        </div>
      )}

      {days.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium">No days created yet.</p>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Days are typically created when users first access them, or you can create them manually.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <div
              key={day.id}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-semibold text-[#1c1f24]">
                      Day {day.day_index}
                    </span>
                    {day.title_en && (
                      <span className="text-[#64748b]">{day.title_en}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-[#64748b]">
                    {day.devotional_en && (
                      <div>
                        <span className="font-semibold text-[#334e62]">Devotional:</span> {day.devotional_en.substring(0, 100)}...
                      </div>
                    )}
                    {day.scriptures_en && day.scriptures_en.length > 0 && (
                      <div>
                        <span className="font-semibold text-[#334e62]">Scriptures:</span> {day.scriptures_en.join(', ')}
                      </div>
                    )}
                    {day.prayer_focus_en && (
                      <div>
                        <span className="font-semibold text-[#334e62]">Prayer Focus:</span> {day.prayer_focus_en.substring(0, 80)}...
                      </div>
                    )}
                    {day.fasting_focus_en && (
                      <div>
                        <span className="font-semibold text-[#334e62]">Fasting Focus:</span> {day.fasting_focus_en.substring(0, 80)}...
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/en/programs/${programSlug}/days/${day.day_index}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(day.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
