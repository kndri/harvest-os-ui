'use client';

import { useState } from 'react';
import { Resource } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface ResourceEditFormProps {
  resource: Resource;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ResourceEditForm({
  resource,
  onSuccess,
  onCancel,
}: ResourceEditFormProps) {
  const [titleEn, setTitleEn] = useState(resource.title_en);
  const [titleFr, setTitleFr] = useState(resource.title_fr || '');
  const [descriptionEn, setDescriptionEn] = useState(resource.description_en || '');
  const [descriptionFr, setDescriptionFr] = useState(resource.description_fr || '');
  const [category, setCategory] = useState(resource.category || '');
  const [language, setLanguage] = useState<'en' | 'fr' | 'both'>(resource.language);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('resources')
        .update({
          title_en: titleEn.trim(),
          title_fr: titleFr.trim() || null,
          description_en: descriptionEn.trim() || null,
          description_fr: descriptionFr.trim() || null,
          category: category.trim() || null,
          language,
        })
        .eq('id', resource.id);

      if (error) throw error;

      onSuccess();
    } catch (err: any) {
      console.error('Error updating resource:', err);
      alert(err.message || 'Error updating resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-[#1c1f24] mb-6">Edit Resource</h2>

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
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="e.g., Handout, Guide, Video"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'both')}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              <option value="both">Both</option>
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> The file itself cannot be changed. To replace the file, delete this resource and upload a new one.
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-6 pt-6 border-t border-[#e2e8f0]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Saving...' : 'Update'}
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
