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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Tagline badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-300 tracking-wide uppercase">
            {t.tagline}
          </span>
        </div>

        {/* Main headline */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t.headline.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line.includes('Growth') || line.includes('Croissance') ? (
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
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
          className={`text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {t.subheadline}
        </p>

        {/* CTAs */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <button
            onClick={() => router.push('/auth/login')}
            className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">{t.cta}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:bg-white/5 transition-all duration-300"
          >
            {t.secondary}
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
