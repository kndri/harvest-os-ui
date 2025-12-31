'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PrayerRequestFormProps {
  programId: string;
  locale: 'en' | 'fr';
  onSuccess?: () => void;
}

export function PrayerRequestForm({ programId, locale, onSuccess }: PrayerRequestFormProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError(locale === 'fr' ? 'Vous devez être connecté' : 'You must be logged in');
        return;
      }

      const { error: insertError } = await supabase
        .from('prayer_requests')
        .insert({
          program_id: programId,
          user_id: user.id,
          content: content.trim(),
          is_anonymous: isAnonymous,
          is_approved: false,
        });

      if (insertError) throw insertError;

      setContent('');
      setIsAnonymous(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || (locale === 'fr' ? 'Erreur lors de la soumission' : 'Error submitting request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 rounded-lg border bg-white">
      <h3 className="text-lg font-semibold mb-4">
        {locale === 'fr' ? 'Soumettre une demande de prière' : 'Submit a Prayer Request'}
      </h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={locale === 'fr' ? 'Votre demande de prière...' : 'Your prayer request...'}
        className="w-full p-3 border rounded-lg mb-4 min-h-[120px] resize-y"
        required
      />
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            {locale === 'fr' ? 'Soumettre anonymement' : 'Submit anonymously'}
          </span>
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSubmitting
          ? (locale === 'fr' ? 'Envoi...' : 'Submitting...')
          : (locale === 'fr' ? 'Soumettre' : 'Submit')}
      </button>
      <p className="text-xs text-gray-500 mt-3">
        {locale === 'fr'
          ? 'Votre demande sera examinée par un modérateur avant d\'être publiée.'
          : 'Your request will be reviewed by a moderator before being published.'}
      </p>
    </form>
  );
}
