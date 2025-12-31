'use client';

import { useState } from 'react';
import { Speaker } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface SpeakerFormProps {
  orgId: string;
  speaker?: Speaker;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SpeakerForm({
  orgId,
  speaker,
  onSuccess,
  onCancel,
}: SpeakerFormProps) {
  const [name, setName] = useState(speaker?.name || '');
  const [bioEn, setBioEn] = useState(speaker?.bio_en || '');
  const [bioFr, setBioFr] = useState(speaker?.bio_fr || '');
  const [photoUrl, setPhotoUrl] = useState(speaker?.photo_url || '');
  const [email, setEmail] = useState(speaker?.email || '');
  const [website, setWebsite] = useState(speaker?.website || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const speakerData = {
        org_id: orgId,
        name: name.trim(),
        bio_en: bioEn.trim() || null,
        bio_fr: bioFr.trim() || null,
        photo_url: photoUrl.trim() || null,
        email: email.trim() || null,
        website: website.trim() || null,
      };

      if (speaker) {
        const { error } = await supabase
          .from('speakers')
          .update(speakerData)
          .eq('id', speaker.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('speakers').insert(speakerData);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving speaker:', err);
      alert(err.message || 'Error saving speaker');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-[#1c1f24] mb-6">
        {speaker ? 'Edit Speaker' : 'Create Speaker'}
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#334e62] mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Bio (English)
            </label>
            <textarea
              value={bioEn}
              onChange={(e) => setBioEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Bio (French)
            </label>
            <textarea
              value={bioFr}
              onChange={(e) => setBioFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Photo URL
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="speaker@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="https://..."
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
          {isSubmitting ? 'Saving...' : speaker ? 'Update' : 'Create'}
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
