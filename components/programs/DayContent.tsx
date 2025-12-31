'use client';

import { useState } from 'react';
import { ProgramDay, Locale, UserDayProgress } from '@/types';

interface DayContentProps {
  day: ProgramDay;
  locale: Locale;
  progress?: UserDayProgress | null;
  onMarkComplete?: () => void;
  onSaveNotes?: (notes: string) => void;
  isLoading?: boolean;
}

export function DayContent({ 
  day, 
  locale, 
  progress, 
  onMarkComplete,
  onSaveNotes,
  isLoading = false
}: DayContentProps) {
  const [notes, setNotes] = useState(progress?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const title = locale === 'fr' && day.title_fr ? day.title_fr : day.title_en;
  const devotional = locale === 'fr' && day.devotional_fr ? day.devotional_fr : day.devotional_en;
  const scriptures = locale === 'fr' && day.scriptures_fr ? day.scriptures_fr : day.scriptures_en;
  const prayerFocus = locale === 'fr' && day.prayer_focus_fr ? day.prayer_focus_fr : day.prayer_focus_en;
  const fastingFocus = locale === 'fr' && day.fasting_focus_fr ? day.fasting_focus_fr : day.fasting_focus_en;
  const activities = locale === 'fr' && day.activities_fr ? day.activities_fr : day.activities_en;
  const reflectionQuestions = locale === 'fr' && day.reflection_questions_fr ? day.reflection_questions_fr : day.reflection_questions_en;
  const familyGuide = locale === 'fr' && day.family_guide_fr ? day.family_guide_fr : day.family_guide_en;

  const handleSaveNotes = async () => {
    if (!onSaveNotes) return;
    setIsSaving(true);
    await onSaveNotes(notes);
    setIsSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-emerald-400 font-medium uppercase tracking-wide mb-1">
            {locale === 'fr' ? 'Jour' : 'Day'} {day.day_index}
          </div>
          {title && (
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          )}
        </div>
        
        {onMarkComplete && (
          <button
            onClick={onMarkComplete}
            disabled={isLoading || !!progress?.completed_at}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              progress?.completed_at
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {progress?.completed_at ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {locale === 'fr' ? 'Terminé' : 'Completed'}
              </span>
            ) : (
              locale === 'fr' ? 'Marquer comme terminé' : 'Mark Complete'
            )}
          </button>
        )}
      </div>

      {/* Devotional */}
      {devotional && (
        <section className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            {locale === 'fr' ? 'Dévotionnel' : 'Devotional'}
          </h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {devotional}
          </div>
        </section>
      )}

      {/* Scriptures */}
      {scriptures && scriptures.length > 0 && (
        <section className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✝️</span>
            {locale === 'fr' ? 'Écritures' : 'Scriptures'}
          </h2>
          <ul className="space-y-2">
            {scriptures.map((scripture, i) => (
              <li key={i} className="text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                {scripture}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prayer Focus */}
      {prayerFocus && (
        <section className="bg-amber-500/5 rounded-xl p-6 border border-amber-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🙏</span>
            {locale === 'fr' ? 'Focus de Prière' : 'Prayer Focus'}
          </h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {prayerFocus}
          </div>
        </section>
      )}

      {/* Fasting Focus */}
      {fastingFocus && (
        <section className="bg-purple-500/5 rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            {locale === 'fr' ? 'Focus de Jeûne' : 'Fasting Focus'}
          </h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {fastingFocus}
          </div>
        </section>
      )}

      {/* Activities */}
      {activities && (
        <section className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            {locale === 'fr' ? 'Activités' : 'Activities'}
          </h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {activities}
          </div>
        </section>
      )}

      {/* Reflection Questions */}
      {reflectionQuestions && reflectionQuestions.length > 0 && (
        <section className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💭</span>
            {locale === 'fr' ? 'Questions de Réflexion' : 'Reflection Questions'}
          </h2>
          <ol className="space-y-3">
            {reflectionQuestions.map((question, i) => (
              <li key={i} className="text-slate-300 flex items-start gap-3">
                <span className="text-blue-400 font-semibold">{i + 1}.</span>
                {question}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Family Guide */}
      {familyGuide && (
        <section className="bg-pink-500/5 rounded-xl p-6 border border-pink-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            {locale === 'fr' ? 'Guide Familial' : 'Family Guide'}
          </h2>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
            {familyGuide}
          </div>
        </section>
      )}

      {/* Personal Notes */}
      {day.notes_enabled && (
        <section className="bg-white/[0.02] rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            {locale === 'fr' ? 'Notes Personnelles' : 'Personal Notes'}
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={locale === 'fr' ? 'Écrivez vos réflexions ici...' : 'Write your reflections here...'}
            className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
          {onSaveNotes && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {isSaving 
                  ? (locale === 'fr' ? 'Sauvegarde...' : 'Saving...') 
                  : (locale === 'fr' ? 'Sauvegarder' : 'Save Notes')}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
