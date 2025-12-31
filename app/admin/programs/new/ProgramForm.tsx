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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            English Title *
          </label>
          <input
            name="title_en"
            required
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="21 Day Fast"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            French Title
          </label>
          <input
            name="title_fr"
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Jeûne de 21 jours"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Slug *
        </label>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
          placeholder="21-day-fast"
        />
        <p className="mt-1 text-sm text-slate-500">URL-friendly identifier (lowercase, hyphens only)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            English Description
          </label>
          <textarea
            name="description_en"
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            placeholder="Join us for a 21-day journey..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            French Description
          </label>
          <textarea
            name="description_fr"
            rows={3}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            placeholder="Rejoignez-nous pour un voyage de 21 jours..."
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Duration (days)
          </label>
          <input
            name="duration_days"
            type="number"
            min="1"
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="21"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            name="start_date"
            type="date"
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            name="end_date"
            type="date"
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            name="is_dated"
            type="checkbox"
            value="true"
            className="w-5 h-5 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
          />
          <span className="text-slate-300">This is a dated program (users follow on specific calendar dates)</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Modules
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.resources" type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Resources</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.prayer_wall" type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Prayer Wall</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.events" type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Events</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.speakers" type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Speakers</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Program'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
