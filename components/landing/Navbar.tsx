'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar({ locale }: { locale: 'en' | 'fr' }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = {
    en: {
      features: 'Features',
      pricing: 'Pricing',
      about: 'About',
      login: 'Sign In',
      cta: 'Get Started',
    },
    fr: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      about: 'À Propos',
      login: 'Connexion',
      cta: 'Commencer',
    },
  };

  const t = content[locale];
  const otherLocale = locale === 'en' ? 'fr' : 'en';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">HarvestOS</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">
              {t.features}
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              {t.pricing}
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">
              {t.about}
            </a>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <button
              onClick={() => router.push(`/${otherLocale}`)}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition-all"
            >
              {otherLocale.toUpperCase()}
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {t.login}
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
            >
              {t.cta}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors py-2">
                {t.features}
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors py-2">
                {t.pricing}
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors py-2">
                {t.about}
              </a>
              <hr className="border-white/5" />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/${otherLocale}`)}
                  className="px-3 py-1.5 text-sm text-slate-400 border border-white/10 rounded-full"
                >
                  {otherLocale.toUpperCase()}
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-slate-300"
                >
                  {t.login}
                </button>
              </div>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-full"
              >
                {t.cta}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
