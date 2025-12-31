'use client';

import Link from 'next/link';
import { Program, ProgramDay, Locale, UserDayProgress } from '@/types';

interface ProgramOverviewProps {
  program: Program;
  days: ProgramDay[];
  locale: Locale;
  todayIndex?: number;
  userProgress?: { [dayId: string]: UserDayProgress };
}

export function ProgramOverview({ 
  program, 
  days, 
  locale, 
  todayIndex,
  userProgress = {}
}: ProgramOverviewProps) {
  const title = locale === 'fr' && program.title_fr ? program.title_fr : program.title_en;
  const description = locale === 'fr' && program.description_fr ? program.description_fr : program.description_en;
  const primaryColor = program.branding?.primary_color || '#10b981';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div 
        className="relative py-20 px-6"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}30 0%, transparent 50%), linear-gradient(to bottom, rgba(15,23,42,0.8), rgb(15,23,42))`,
        }}
      >
        {program.branding?.banner_url && (
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${program.branding.banner_url})` }}
          />
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          
          {/* Progress bar */}
          {Object.keys(userProgress).length > 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>{locale === 'fr' ? 'Progression' : 'Progress'}</span>
                <span>
                  {Object.values(userProgress).filter(p => p.completed_at).length}/{days.length}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ 
                    width: `${(Object.values(userProgress).filter(p => p.completed_at).length / days.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-white/5 sticky top-0 bg-slate-950/80 backdrop-blur-lg z-20">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-8">
            <button className="py-4 text-white border-b-2 border-emerald-500 font-medium">
              {locale === 'fr' ? 'Jours' : 'Days'}
            </button>
            {program.config?.events && (
              <Link 
                href={`/${locale}/programs/${program.slug}/events`}
                className="py-4 text-slate-400 hover:text-white transition-colors"
              >
                {locale === 'fr' ? 'Événements' : 'Events'}
              </Link>
            )}
            {program.config?.resources && (
              <Link 
                href={`/${locale}/programs/${program.slug}/resources`}
                className="py-4 text-slate-400 hover:text-white transition-colors"
              >
                {locale === 'fr' ? 'Ressources' : 'Resources'}
              </Link>
            )}
            {program.config?.prayer_wall && (
              <Link 
                href={`/${locale}/programs/${program.slug}/prayer-wall`}
                className="py-4 text-slate-400 hover:text-white transition-colors"
              >
                {locale === 'fr' ? 'Mur de Prière' : 'Prayer Wall'}
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Days grid */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {days.map((day) => {
            const dayTitle = locale === 'fr' && day.title_fr ? day.title_fr : day.title_en;
            const isToday = day.day_index === todayIndex;
            const isCompleted = userProgress[day.id]?.completed_at;
            
            return (
              <Link
                key={day.id}
                href={`/${locale}/programs/${program.slug}/days/${day.day_index}`}
                className={`relative p-6 rounded-xl border transition-all duration-300 group ${
                  isToday 
                    ? 'bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                }`}
              >
                {/* Completion indicator */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                <div className="text-3xl font-bold text-white mb-1">
                  {day.day_index}
                </div>
                
                {dayTitle && (
                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                    {dayTitle}
                  </div>
                )}
                
                {isToday && (
                  <div className="mt-3 text-xs font-medium text-emerald-400 uppercase tracking-wide">
                    {locale === 'fr' ? "Aujourd'hui" : 'Today'}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
