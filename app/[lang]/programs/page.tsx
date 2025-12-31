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
  
  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  if (user) {
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('user_id', user.id)
      .single();
    userRole = membership?.role || null;
  }
  
  // Query published programs - RLS allows public access to published programs
  // If user is logged in, they can also see programs from their org
  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (programsError) {
    console.error('Error fetching programs:', programsError);
  }

  // Debug: Log program count
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Programs Page] Found ${programs?.length || 0} published programs`);
  }

  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fafbfc] to-white">
      <Navbar locale={locale} user={user} userRole={userRole} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1c1f24] mb-4">
              {dict.programs.title}
            </h1>
            <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
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
              <h2 className="text-2xl font-semibold text-[#1c1f24] mb-2">
                {locale === 'fr' ? 'Aucun programme disponible' : 'No Programs Available'}
              </h2>
              <p className="text-[#64748b]">
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
