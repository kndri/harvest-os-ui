import { createServerClient } from '@/lib/supabase/server';
import { ProgramCard } from '@/components/programs';
import { getDictionary } from '@/lib/i18n';
import { Navbar } from '@/components/landing/Navbar';
import { Program, Locale } from '@/types';

export default async function ProgramsListPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const supabase = await createServerClient();
  
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar locale={locale} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {dict.programs.title}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {locale === 'fr' 
                ? 'Explorez nos programmes et rejoignez votre communauté dans la croissance spirituelle.'
                : 'Explore our programs and join your community in spiritual growth.'}
            </p>
          </div>

          {programs && programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard 
                  key={program.id} 
                  program={program as Program} 
                  locale={locale} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {locale === 'fr' ? 'Aucun programme disponible' : 'No Programs Available'}
              </h2>
              <p className="text-slate-400">
                {locale === 'fr' 
                  ? 'Revenez bientôt pour découvrir nos nouveaux programmes.'
                  : 'Check back soon for new programs.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
