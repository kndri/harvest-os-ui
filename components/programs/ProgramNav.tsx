'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Program } from '@/types';
import { Locale } from '@/types';

interface ProgramNavProps {
  program: Program;
  locale: Locale;
}

export function ProgramNav({ program, locale }: ProgramNavProps) {
  const pathname = usePathname();
  const programTitle = locale === 'fr' && program.title_fr ? program.title_fr : program.title_en;

  const navItems = [
    {
      label: locale === 'fr' ? 'Jours' : 'Days',
      href: `/${locale}/programs/${program.slug}`,
      exact: true,
    },
    ...(program.config?.events
      ? [
          {
            label: locale === 'fr' ? 'Événements' : 'Events',
            href: `/${locale}/programs/${program.slug}/events`,
            exact: false,
          },
        ]
      : []),
    ...(program.config?.resources
      ? [
          {
            label: locale === 'fr' ? 'Ressources' : 'Resources',
            href: `/${locale}/programs/${program.slug}/resources`,
            exact: false,
          },
        ]
      : []),
    ...(program.config?.prayer_wall
      ? [
          {
            label: locale === 'fr' ? 'Mur de Prière' : 'Prayer Wall',
            href: `/${locale}/programs/${program.slug}/prayer-wall`,
            exact: false,
          },
        ]
      : []),
    ...(program.config?.speakers
      ? [
          {
            label: locale === 'fr' ? 'Conférenciers' : 'Speakers',
            href: `/${locale}/programs/${program.slug}/speakers`,
            exact: false,
          },
        ]
      : []),
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/programs/${program.slug}`}
              className="text-lg font-semibold text-[#1c1f24] hover:text-emerald-600 transition-colors"
            >
              {programTitle}
            </Link>
            <div className="h-6 w-px bg-[#e2e8f0]" />
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact || false);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      active
                        ? 'text-[#1c1f24] border-b-2 border-emerald-500 pb-4 -mb-4'
                        : 'text-[#64748b] hover:text-[#1c1f24]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <Link
            href={`/${locale}/programs`}
            className="text-sm text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium"
          >
            {locale === 'fr' ? '← Tous les programmes' : '← All Programs'}
          </Link>
        </div>
      </div>
    </div>
  );
}
