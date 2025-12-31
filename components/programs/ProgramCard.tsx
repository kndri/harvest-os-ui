'use client';

import Link from 'next/link';
import { Program, Locale } from '@/types';

interface ProgramCardProps {
  program: Program;
  locale: Locale;
}

export function ProgramCard({ program, locale }: ProgramCardProps) {
  const title = locale === 'fr' && program.title_fr ? program.title_fr : program.title_en;
  const description = locale === 'fr' && program.description_fr ? program.description_fr : program.description_en;
  const primaryColor = program.branding?.primary_color || '#10b981';

  return (
    <Link href={`/${locale}/programs/${program.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
        {/* Banner image */}
        {program.branding?.banner_url ? (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={program.branding.banner_url} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          </div>
        ) : (
          <div 
            className="h-48 relative"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}40 0%, ${primaryColor}10 100%)` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-slate-400 line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Program info */}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {program.duration_days && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {program.duration_days} {locale === 'fr' ? 'jours' : 'days'}
              </span>
            )}
            
            {program.start_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(program.start_date).toLocaleDateString(locale)}
              </span>
            )}
          </div>

          {/* Module badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {program.config?.resources && (
              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {locale === 'fr' ? 'Ressources' : 'Resources'}
              </span>
            )}
            {program.config?.prayer_wall && (
              <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {locale === 'fr' ? 'Mur de Prière' : 'Prayer Wall'}
              </span>
            )}
            {program.config?.events && (
              <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                {locale === 'fr' ? 'Événements' : 'Events'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
