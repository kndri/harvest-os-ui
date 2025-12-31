'use client';

const testimonials = {
  en: [
    {
      quote: "HarvestOS transformed how we manage our church programs. The bilingual support means we can finally serve our entire congregation seamlessly.",
      author: "Pastor Michael Chen",
      role: "Senior Pastor, Grace Community Church",
      avatar: "MC",
    },
    {
      quote: "The budgeting module alone saved us countless hours. Real-time expense tracking and audit logs give our finance team complete peace of mind.",
      author: "Sarah Williams",
      role: "Finance Director, New Life Fellowship",
      avatar: "SW",
    },
    {
      quote: "Our prayer wall engagement increased 300% since switching to HarvestOS. Members feel more connected than ever before.",
      author: "Rev. Emmanuel Okonkwo",
      role: "Lead Pastor, Cornerstone Church",
      avatar: "EO",
    },
  ],
  fr: [
    {
      quote: "HarvestOS a transformé notre gestion des programmes. Le support bilingue nous permet enfin de servir toute notre congrégation.",
      author: "Pasteur Michel Tremblay",
      role: "Pasteur Principal, Église de la Grâce",
      avatar: "MT",
    },
    {
      quote: "Le module de budget nous a fait gagner d'innombrables heures. Le suivi en temps réel donne une tranquillité d'esprit à notre équipe.",
      author: "Marie Dubois",
      role: "Directrice Financière, Église Nouvelle Vie",
      avatar: "MD",
    },
    {
      quote: "L'engagement sur notre mur de prière a augmenté de 300% depuis HarvestOS. Les membres se sentent plus connectés que jamais.",
      author: "Rév. Pierre Lafontaine",
      role: "Pasteur Principal, Église Pierre Angulaire",
      avatar: "PL",
    },
  ],
};

export function Testimonials({ locale }: { locale: 'en' | 'fr' }) {
  const content = {
    en: {
      tagline: 'Trusted by Churches',
      headline: 'Loved by Leaders',
    },
    fr: {
      tagline: 'Approuvé par les Églises',
      headline: 'Aimé par les Leaders',
    },
  };

  const t = content[locale];
  const testimonialList = testimonials[locale];

  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium tracking-wide uppercase mb-6">
            {t.tagline}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            {t.headline}
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonialList.map((testimonial, i) => (
            <div
              key={i}
              className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-8 text-6xl text-emerald-500/20 font-serif">
                "
              </div>

              <blockquote className="relative">
                <p className="text-slate-300 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>

                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
