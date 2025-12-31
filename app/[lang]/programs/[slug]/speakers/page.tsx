import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { SpeakerCard } from '@/components/events/SpeakerCard';
import { ProgramNav } from '@/components/programs';
import { Speaker, Program } from '@/lib/types';

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
    .select('*')
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
    <div className="min-h-screen bg-white">
      <ProgramNav program={program as Program} locale={locale} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c1f24] mb-4">
          {locale === 'fr' ? 'Conférenciers' : 'Speakers'}
        </h1>
        <p className="text-xl text-[#64748b] mb-12">
          {locale === 'fr' ? 'Rencontrez les conférenciers du programme' : 'Meet the program speakers'}
        </p>
        
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
          <div className="text-center py-12 bg-white rounded-xl border border-[#e2e8f0]">
            <p className="text-[#64748b] font-medium">
              {locale === 'fr' ? 'Aucun conférencier disponible.' : 'No speakers available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
