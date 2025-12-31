import { Navbar, Hero, Features, Stats, Testimonials, CTA, Footer } from '@/components/landing';
import { createServerClient } from '@/lib/supabase/server';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user's role if logged in
  let userRole: string | null = null;
  if (user) {
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('user_id', user.id)
      .single();
    userRole = membership?.role || null;
  }

  return (
    <main className="bg-white">
      <Navbar locale={locale} user={user} userRole={userRole} />
      <Hero locale={locale} />
      <Features locale={locale} />
      <Stats locale={locale} />
      <Testimonials locale={locale} />
      <CTA locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
