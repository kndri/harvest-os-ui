'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  locale: 'en' | 'fr';
  user?: User | null;
  userRole?: string | null;
}

export function Navbar({ locale, user, userRole }: NavbarProps) {
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
          ? 'bg-white/80 backdrop-blur-xl border-b border-[#e2e8f0] shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1c1f24]">HarvestOS</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium">
              {t.features}
            </a>
            <a href="#" className="text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium">
              {t.pricing}
            </a>
            <a href="#" className="text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium">
              {t.about}
            </a>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <button
              onClick={() => router.push(`/${otherLocale}`)}
              className="px-3 py-1.5 text-sm text-[#64748b] hover:text-[#1c1f24] border border-[#e2e8f0] rounded-full hover:bg-[#f2f4f6] transition-all bg-white/80 backdrop-blur-sm"
            >
              {otherLocale.toUpperCase()}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => {
                    if (userRole === 'admin') {
                      router.push('/admin');
                    } else {
                      router.push(`/${locale}/programs`);
                    }
                  }}
                  className="px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
                >
                  {userRole === 'admin' ? 'Dashboard' : 'My Programs'}
                </button>
                <button
                  onClick={async () => {
                    const { createClient } = await import('@/lib/supabase/client');
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push(`/${locale}`);
                    router.refresh();
                  }}
                  className="text-[#64748b] hover:text-[#1c1f24] transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium"
                >
                  {t.login}
                </button>

                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-5 py-2.5 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
                >
                  {t.cta}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1c1f24]"
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
          <div className="md:hidden py-4 border-t border-[#e2e8f0] bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-[#64748b] hover:text-[#1c1f24] transition-colors py-2 font-medium">
                {t.features}
              </a>
              <a href="#" className="text-[#64748b] hover:text-[#1c1f24] transition-colors py-2 font-medium">
                {t.pricing}
              </a>
              <a href="#" className="text-[#64748b] hover:text-[#1c1f24] transition-colors py-2 font-medium">
                {t.about}
              </a>
              <hr className="border-[#e2e8f0]" />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push(`/${otherLocale}`)}
                  className="px-3 py-1.5 text-sm text-[#64748b] border border-[#e2e8f0] rounded-full bg-white"
                >
                  {otherLocale.toUpperCase()}
                </button>
                {user ? (
                  <button
                    onClick={async () => {
                      const { createClient } = await import('@/lib/supabase/client');
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push(`/${locale}`);
                      router.refresh();
                    }}
                    className="text-[#64748b] font-medium"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-[#64748b] font-medium"
                  >
                    {t.login}
                  </button>
                )}
              </div>
              {user ? (
                <button
                  onClick={() => {
                    if (userRole === 'admin') {
                      router.push('/admin');
                    } else {
                      router.push(`/${locale}/programs`);
                    }
                  }}
                  className="w-full px-5 py-3 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600"
                >
                  {userRole === 'admin' ? 'Dashboard' : 'My Programs'}
                </button>
              ) : (
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full px-5 py-3 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600"
                >
                  {t.cta}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
