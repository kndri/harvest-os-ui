'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProgram, publishProgram, archiveProgram } from '@/lib/actions/programs';
import { Program } from '@/types';

interface EditProgramFormProps {
  program: Program;
}

export function EditProgramForm({ program }: EditProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateProgram(program.id, formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/programs');
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishProgram(program.id);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      const result = await archiveProgram(program.id);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
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

      {/* Status banner */}
      <div className={`p-4 rounded-lg flex items-center justify-between ${
        program.status === 'published' 
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : program.status === 'draft'
          ? 'bg-amber-500/10 border border-amber-500/20'
          : 'bg-slate-500/10 border border-slate-500/20'
      }`}>
        <div>
          <span className="text-sm font-medium text-slate-400">Status:</span>
          <span className={`ml-2 ${
            program.status === 'published' ? 'text-emerald-400' :
            program.status === 'draft' ? 'text-amber-400' : 'text-slate-400'
          }`}>
            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
          </span>
        </div>
        <div className="flex gap-2">
          {program.status === 'draft' && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPending}
              className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Publish
            </button>
          )}
          {program.status === 'published' && (
            <button
              type="button"
              onClick={handleArchive}
              disabled={isPending}
              className="px-4 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            English Title *
          </label>
          <input
            name="title_en"
            required
            defaultValue={program.title_en}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            French Title
          </label>
          <input
            name="title_fr"
            defaultValue={program.title_fr || ''}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
          defaultValue={program.slug}
          className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            English Description
          </label>
          <textarea
            name="description_en"
            rows={3}
            defaultValue={program.description_en || ''}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            French Description
          </label>
          <textarea
            name="description_fr"
            rows={3}
            defaultValue={program.description_fr || ''}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
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
            defaultValue={program.duration_days || ''}
            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            name="start_date"
            type="date"
            defaultValue={program.start_date || ''}
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
            defaultValue={program.end_date || ''}
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
            defaultChecked={program.is_dated}
            className="w-5 h-5 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
          />
          <span className="text-slate-300">This is a dated program</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Modules
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.resources" type="checkbox" defaultChecked={program.config?.resources} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Resources</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.prayer_wall" type="checkbox" defaultChecked={program.config?.prayer_wall} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Prayer Wall</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.events" type="checkbox" defaultChecked={program.config?.events} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
            <span className="text-slate-400">Events</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input name="config.speakers" type="checkbox" defaultChecked={program.config?.speakers} className="w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500" />
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
          {isPending ? 'Saving...' : 'Save Changes'}
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
