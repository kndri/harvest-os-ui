'use client';

import { useRouter } from 'next/navigation';

export function CTA({ locale }: { locale: 'en' | 'fr' }) {
  const router = useRouter();

  const content = {
    en: {
      headline: 'Ready to Transform Your Church?',
      subheadline: 'Join hundreds of churches already growing with HarvestOS.',
      cta: 'Get Started Free',
      secondary: 'Schedule a Demo',
    },
    fr: {
      headline: 'Prêt à Transformer Votre Église?',
      subheadline: 'Rejoignez des centaines d\'églises qui croissent déjà avec HarvestOS.',
      cta: 'Commencer Gratuitement',
      secondary: 'Planifier une Démo',
    },
  };

  const t = content[locale];

  return (
    <section className="relative py-32 bg-gradient-to-br from-emerald-50 via-white to-[#fafbfc] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1c1f24] mb-6 leading-tight">
          {t.headline}
        </h2>
        <p className="text-xl text-[#64748b] mb-12 max-w-2xl mx-auto">
          {t.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push('/auth/login')}
            className="px-10 py-5 bg-emerald-500 text-white text-lg font-semibold rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:bg-emerald-600 transition-all duration-300 hover:scale-105"
          >
            {t.cta}
          </button>
          
          <button className="px-10 py-5 text-[#334e62] text-lg font-medium rounded-full border border-[#e2e8f0] bg-white hover:bg-[#f2f4f6] hover:shadow-md transition-all duration-300">
            {t.secondary}
          </button>
        </div>
      </div>
    </section>
  );
}
