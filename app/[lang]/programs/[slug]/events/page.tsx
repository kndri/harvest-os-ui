import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EventCard } from '@/components/events/EventCard';
import { ProgramEvent } from '@/lib/types';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  
  const supabase = await createServerClient();
  
  // Get program first
  const { data: program } = await supabase
    .from('programs')
    .select('id, title_en, title_fr')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get events with speakers
  const { data: events } = await supabase
    .from('program_events')
    .select(`
      *,
      speaker:speakers(*)
    `)
    .eq('program_id', program.id)
    .order('starts_at', { ascending: true });
  
  const now = new Date();
  const upcomingEvents = (events || []).filter(
    (e: ProgramEvent) => new Date(e.starts_at) >= now
  );
  const pastEvents = (events || []).filter(
    (e: ProgramEvent) => new Date(e.starts_at) < now
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'fr' ? 'Événements' : 'Events'}
      </h1>
      
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {locale === 'fr' ? 'Événements à venir' : 'Upcoming Events'}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event: ProgramEvent) => (
              <EventCard
                key={event.id}
                event={event}
                locale={locale}
                programSlug={slug}
              />
            ))}
          </div>
        </section>
      )}
      
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            {locale === 'fr' ? 'Événements passés' : 'Past Events'}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event: ProgramEvent) => (
              <EventCard
                key={event.id}
                event={event}
                locale={locale}
                programSlug={slug}
              />
            ))}
          </div>
        </section>
      )}
      
      {events?.length === 0 && (
        <p className="text-gray-600 text-center py-12">
          {locale === 'fr' ? 'Aucun événement prévu.' : 'No events scheduled.'}
        </p>
      )}
    </div>
  );
}
