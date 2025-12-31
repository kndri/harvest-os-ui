import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { SpeakerCard } from '@/components/events/SpeakerCard';
import { Speaker } from '@/lib/types';

export default async function SpeakersPage({
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
    .select('id, org_id')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get speakers for this org
  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('org_id', program.org_id)
    .order('name', { ascending: true });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'fr' ? 'Conférenciers' : 'Speakers'}
      </h1>
      
      {speakers && speakers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker: Speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              locale={locale}
              programSlug={slug}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-12">
          {locale === 'fr' ? 'Aucun conférencier disponible.' : 'No speakers available.'}
        </p>
      )}
    </div>
  );
}
