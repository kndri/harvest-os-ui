import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AddToCalendar } from '@/components/events/AddToCalendar';
import { SpeakerCard } from '@/components/events/SpeakerCard';
import { format } from 'date-fns';
import { getLocalizedText } from '@/lib/i18n';
import Link from 'next/link';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string; eventId: string }>;
}) {
  const { lang, slug, eventId } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  
  const supabase = await createServerClient();
  
  // Get event with speaker
  const { data: event } = await supabase
    .from('program_events')
    .select(`
      *,
      speaker:speakers(*)
    `)
    .eq('id', eventId)
    .single();
  
  if (!event) {
    notFound();
  }
  
  const title = getLocalizedText(event.title_en, event.title_fr, locale);
  const description = getLocalizedText(event.description_en, event.description_fr, locale);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/${lang}/programs/${slug}/events`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← {locale === 'fr' ? 'Retour aux événements' : 'Back to Events'}
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {format(new Date(event.starts_at), 'EEEE, MMMM d, yyyy')}
            </span>
            <span>
              {format(new Date(event.starts_at), 'h:mm a')}
              {event.ends_at && (
                <> - {format(new Date(event.ends_at), 'h:mm a')}</>
              )}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <AddToCalendar event={event} locale={locale} />
        </div>
        
        {description && (
          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 whitespace-pre-wrap">{description}</p>
          </div>
        )}
        
        {event.speaker && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              {locale === 'fr' ? 'Conférencier' : 'Speaker'}
            </h2>
            <SpeakerCard
              speaker={event.speaker}
              locale={locale}
              programSlug={slug}
            />
          </section>
        )}
        
        {event.livestream_url && (
          <div className="mt-8">
            <a
              href={event.livestream_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block font-medium"
            >
              {locale === 'fr' ? 'Regarder en direct' : 'Watch Live'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
