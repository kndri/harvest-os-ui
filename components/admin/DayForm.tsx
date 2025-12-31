'use client';

import { useState, useEffect } from 'react';
import { ProgramDay } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface DayFormProps {
  programId: string;
  day?: ProgramDay;
  existingDayIndexes: number[];
  onSuccess: () => void;
  onCancel: () => void;
}

function ArrayInput({
  label,
  values,
  onChange,
  placeholder = 'Enter item and press Enter',
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onChange([...values, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#334e62] mb-2">
        {label}
      </label>
      <div className="space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
        />
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.map((value, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-200"
              >
                {value}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-emerald-700 hover:text-emerald-900 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DayForm({
  programId,
  day,
  existingDayIndexes,
  onSuccess,
  onCancel,
}: DayFormProps) {
  const [dayIndex, setDayIndex] = useState(day?.day_index || 1);
  const [titleEn, setTitleEn] = useState(day?.title_en || '');
  const [titleFr, setTitleFr] = useState(day?.title_fr || '');
  const [devotionalEn, setDevotionalEn] = useState(day?.devotional_en || '');
  const [devotionalFr, setDevotionalFr] = useState(day?.devotional_fr || '');
  const [scripturesEn, setScripturesEn] = useState<string[]>(day?.scriptures_en || []);
  const [scripturesFr, setScripturesFr] = useState<string[]>(day?.scriptures_fr || []);
  const [prayerFocusEn, setPrayerFocusEn] = useState(day?.prayer_focus_en || '');
  const [prayerFocusFr, setPrayerFocusFr] = useState(day?.prayer_focus_fr || '');
  const [fastingFocusEn, setFastingFocusEn] = useState(day?.fasting_focus_en || '');
  const [fastingFocusFr, setFastingFocusFr] = useState(day?.fasting_focus_fr || '');
  const [activitiesEn, setActivitiesEn] = useState(day?.activities_en || '');
  const [activitiesFr, setActivitiesFr] = useState(day?.activities_fr || '');
  const [reflectionQuestionsEn, setReflectionQuestionsEn] = useState<string[]>(
    day?.reflection_questions_en || []
  );
  const [reflectionQuestionsFr, setReflectionQuestionsFr] = useState<string[]>(
    day?.reflection_questions_fr || []
  );
  const [familyGuideEn, setFamilyGuideEn] = useState(day?.family_guide_en || '');
  const [familyGuideFr, setFamilyGuideFr] = useState(day?.family_guide_fr || '');
  const [mediaUrls, setMediaUrls] = useState<string[]>(day?.media_urls || []);
  const [notesEnabled, setNotesEnabled] = useState(day?.notes_enabled ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate next available day index if creating new day
  useEffect(() => {
    if (!day && existingDayIndexes.length > 0) {
      const maxIndex = Math.max(...existingDayIndexes);
      setDayIndex(maxIndex + 1);
    }
  }, [day, existingDayIndexes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const dayData = {
        program_id: programId,
        day_index: dayIndex,
        title_en: titleEn.trim() || null,
        title_fr: titleFr.trim() || null,
        devotional_en: devotionalEn.trim() || null,
        devotional_fr: devotionalFr.trim() || null,
        scriptures_en: scripturesEn.length > 0 ? scripturesEn : null,
        scriptures_fr: scripturesFr.length > 0 ? scripturesFr : null,
        prayer_focus_en: prayerFocusEn.trim() || null,
        prayer_focus_fr: prayerFocusFr.trim() || null,
        fasting_focus_en: fastingFocusEn.trim() || null,
        fasting_focus_fr: fastingFocusFr.trim() || null,
        activities_en: activitiesEn.trim() || null,
        activities_fr: activitiesFr.trim() || null,
        reflection_questions_en: reflectionQuestionsEn.length > 0 ? reflectionQuestionsEn : null,
        reflection_questions_fr: reflectionQuestionsFr.length > 0 ? reflectionQuestionsFr : null,
        family_guide_en: familyGuideEn.trim() || null,
        family_guide_fr: familyGuideFr.trim() || null,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        notes_enabled: notesEnabled,
      };

      if (day) {
        const { error } = await supabase
          .from('program_days')
          .update(dayData)
          .eq('id', day.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('program_days').insert(dayData);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error saving day:', err);
      alert(err.message || 'Error saving day');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold text-[#1c1f24] mb-6">
        {day ? 'Edit Day' : 'Create Day'}
      </h2>

      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Day Index *
            </label>
            <input
              type="number"
              min="1"
              value={dayIndex}
              onChange={(e) => setDayIndex(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
              Devotional (English)
            </label>
            <textarea
              value={devotionalEn}
              onChange={(e) => setDevotionalEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Devotional (French)
            </label>
            <textarea
              value={devotionalFr}
              onChange={(e) => setDevotionalFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={6}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ArrayInput
            label="Scriptures (English)"
            values={scripturesEn}
            onChange={setScripturesEn}
            placeholder="Enter scripture reference (e.g., John 3:16)"
          />
          <ArrayInput
            label="Scriptures (French)"
            values={scripturesFr}
            onChange={setScripturesFr}
            placeholder="Entrez la référence biblique"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Prayer Focus (English)
            </label>
            <textarea
              value={prayerFocusEn}
              onChange={(e) => setPrayerFocusEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Prayer Focus (French)
            </label>
            <textarea
              value={prayerFocusFr}
              onChange={(e) => setPrayerFocusFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Fasting Focus (English)
            </label>
            <textarea
              value={fastingFocusEn}
              onChange={(e) => setFastingFocusEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Fasting Focus (French)
            </label>
            <textarea
              value={fastingFocusFr}
              onChange={(e) => setFastingFocusFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Activities (English)
            </label>
            <textarea
              value={activitiesEn}
              onChange={(e) => setActivitiesEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Activities (French)
            </label>
            <textarea
              value={activitiesFr}
              onChange={(e) => setActivitiesFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ArrayInput
            label="Reflection Questions (English)"
            values={reflectionQuestionsEn}
            onChange={setReflectionQuestionsEn}
            placeholder="Enter question and press Enter"
          />
          <ArrayInput
            label="Reflection Questions (French)"
            values={reflectionQuestionsFr}
            onChange={setReflectionQuestionsFr}
            placeholder="Entrez la question et appuyez sur Entrée"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Family Guide (English)
            </label>
            <textarea
              value={familyGuideEn}
              onChange={(e) => setFamilyGuideEn(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#334e62] mb-2">
              Family Guide (French)
            </label>
            <textarea
              value={familyGuideFr}
              onChange={(e) => setFamilyGuideFr(e.target.value)}
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
              rows={4}
            />
          </div>
        </div>

        <ArrayInput
          label="Media URLs"
          values={mediaUrls}
          onChange={setMediaUrls}
          placeholder="Enter URL and press Enter"
        />

        <div className="p-4 bg-[#fafbfc] rounded-xl border border-[#e2e8f0]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notesEnabled}
              onChange={(e) => setNotesEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-[#cbd5e1] bg-white text-emerald-500 focus:ring-emerald-500/50 focus:ring-2"
            />
            <span className="text-[#334e62] font-medium">Enable notes for this day</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 mt-6 pt-6 border-t border-[#e2e8f0]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Saving...' : day ? 'Update' : 'Create'}
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
