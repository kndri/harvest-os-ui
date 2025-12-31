'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProgram } from '@/lib/actions/programs';

interface ProgramFormProps {
  orgId: string;
}

export function ProgramForm({ orgId }: ProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('org_id', orgId);
    
    startTransition(async () => {
      const result = await createProgram(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/programs');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              English Title *
            </label>
            <input
              name="title_en"
              required
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="21 Day Fast"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              French Title
            </label>
            <input
              name="title_fr"
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="Jeûne de 21 jours"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#334e62] mb-2">
            Slug *
          </label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
            placeholder="21-day-fast"
          />
          <p className="mt-2 text-sm text-[#64748b]">URL-friendly identifier (lowercase, hyphens only)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              English Description
            </label>
            <textarea
              name="description_en"
              rows={4}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              placeholder="Join us for a 21-day journey..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              French Description
            </label>
            <textarea
              name="description_fr"
              rows={4}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              placeholder="Rejoignez-nous pour un voyage de 21 jours..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Duration (days)
            </label>
            <input
              name="duration_days"
              type="number"
              min="1"
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="21"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Start Date
            </label>
            <input
              name="start_date"
              type="date"
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              End Date
            </label>
            <input
              name="end_date"
              type="date"
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-[#fafbfc] rounded-xl border border-[#e2e8f0]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              name="is_dated"
              type="checkbox"
              value="true"
              className="w-5 h-5 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50 focus:ring-2"
            />
            <span className="text-[#334e62] font-medium">This is a dated program (users follow on specific calendar dates)</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#334e62] mb-3">
            Modules
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#fafbfc] rounded-xl border border-[#e2e8f0] hover:border-emerald-500/50 transition-colors">
              <input name="config.resources" type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-[#334e62] font-medium">Resources</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#fafbfc] rounded-xl border border-[#e2e8f0] hover:border-emerald-500/50 transition-colors">
              <input name="config.prayer_wall" type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-[#334e62] font-medium">Prayer Wall</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#fafbfc] rounded-xl border border-[#e2e8f0] hover:border-emerald-500/50 transition-colors">
              <input name="config.events" type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-[#334e62] font-medium">Events</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#fafbfc] rounded-xl border border-[#e2e8f0] hover:border-emerald-500/50 transition-colors">
              <input name="config.speakers" type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-[#334e62] font-medium">Speakers</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-[#e2e8f0]">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Program'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#f2f4f6] text-[#334e62] font-medium rounded-xl hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
