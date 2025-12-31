'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Hero({ locale }: { locale: 'en' | 'fr' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = {
    en: {
      tagline: 'Church Management, Reimagined',
      headline: 'Cultivate Growth.\nNurture Community.',
      subheadline: 'The all-in-one platform for modern churches to manage programs, engage members, and steward resources with excellence.',
      cta: 'Start Your Journey',
      secondary: 'See How It Works',
    },
    fr: {
      tagline: 'Gestion d\'Église, Réinventée',
      headline: 'Cultivez la Croissance.\nNourrissez la Communauté.',
      subheadline: 'La plateforme tout-en-un pour les églises modernes afin de gérer les programmes, engager les membres et gérer les ressources avec excellence.',
      cta: 'Commencez Votre Voyage',
      secondary: 'Découvrez Comment',
    },
  };

  const t = content[locale];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#fafbfc] to-[#f2f4f6]">
      {/* Soft background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#cab3d9]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-[#f9e0ca]/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(28,31,36,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,31,36,.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Tagline badge */}
        <div 
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#e2e8f0] shadow-sm mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-[#334e62] tracking-wide uppercase">
            {t.tagline}
          </span>
        </div>

        {/* Main headline */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-[#1c1f24] leading-[1.1] tracking-tight mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t.headline.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line.includes('Growth') || line.includes('Croissance') ? (
                <span className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p 
          className={`text-lg md:text-xl text-[#64748b] max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t.subheadline}
        </p>

        {/* CTAs */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <button
            onClick={() => router.push('/auth/login')}
            className="group relative px-8 py-4 bg-emerald-500 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
          >
            <span className="relative z-10">{t.cta}</span>
          </button>
          
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 text-[#334e62] font-medium rounded-full border border-[#e2e8f0] bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300"
          >
            {t.secondary}
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#cbd5e1] flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#94a3b8] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
