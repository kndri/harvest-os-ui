import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getLocalizedText } from '@/lib/i18n';
import Link from 'next/link';

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string; speakerId: string }>;
}) {
  const { lang, slug, speakerId } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  
  const supabase = await createServerClient();
  
  // Get speaker
  const { data: speaker } = await supabase
    .from('speakers')
    .select('*')
    .eq('id', speakerId)
    .single();
  
  if (!speaker) {
    notFound();
  }
  
  // Get events for this speaker
  const { data: events } = await supabase
    .from('program_events')
    .select('id, title_en, title_fr, starts_at')
    .eq('speaker_id', speakerId)
    .order('starts_at', { ascending: true });
  
  const bio = getLocalizedText(speaker.bio_en, speaker.bio_fr, locale);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/${lang}/programs/${slug}/speakers`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← {locale === 'fr' ? 'Retour aux conférenciers' : 'Back to Speakers'}
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {speaker.photo_url ? (
            <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
              <img
                src={speaker.photo_url}
                alt={speaker.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
              <span className="text-6xl text-gray-600">
                {speaker.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{speaker.name}</h1>
            {speaker.email && (
              <p className="text-gray-600 mb-2">{speaker.email}</p>
            )}
            {speaker.website && (
              <a
                href={speaker.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {speaker.website}
              </a>
            )}
          </div>
        </div>
        
        {bio && (
          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {locale === 'fr' ? 'Biographie' : 'Biography'}
            </h2>
            <p className="text-lg text-gray-700 whitespace-pre-wrap">{bio}</p>
          </div>
        )}
        
        {events && events.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {locale === 'fr' ? 'Événements' : 'Events'}
            </h2>
            <div className="space-y-4">
              {events.map((event) => {
                const eventTitle = getLocalizedText(event.title_en, event.title_fr, locale);
                return (
                  <Link
                    key={event.id}
                    href={`/${lang}/programs/${slug}/events/${event.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{eventTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.starts_at).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
