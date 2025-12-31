import { Navbar, Hero, Features, Stats, Testimonials, CTA, Footer } from '@/components/landing';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';

  return (
    <main className="bg-slate-950">
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <Features locale={locale} />
      <Stats locale={locale} />
      <Testimonials locale={locale} />
      <CTA locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}
