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
    <div className="min-h-screen bg-white">
      {/* Days grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c1f24] mb-4">
          {locale === 'fr' ? 'Jours' : 'Days'}
        </h1>
        <p className="text-xl text-[#64748b] mb-12">
          {locale === 'fr' ? 'Parcourez les jours du programme' : 'Browse program days'}
        </p>
        
        {/* Progress bar */}
        {Object.keys(userProgress).length > 0 && (
          <div className="mb-12 max-w-md">
            <div className="flex justify-between text-sm text-[#64748b] mb-2">
              <span className="font-medium">{locale === 'fr' ? 'Progression' : 'Progress'}</span>
              <span className="font-semibold text-[#1c1f24]">
                {Object.values(userProgress).filter(p => p.completed_at).length}/{days.length}
              </span>
            </div>
            <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ 
                  width: `${(Object.values(userProgress).filter(p => p.completed_at).length / days.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {days.map((day) => {
            const dayTitle = locale === 'fr' && day.title_fr ? day.title_fr : day.title_en;
            const isToday = day.day_index === todayIndex;
            const isCompleted = userProgress[day.id]?.completed_at;
            
            return (
              <Link
                key={day.id}
                href={`/${locale}/programs/${program.slug}/days/${day.day_index}`}
                className={`relative bg-white border border-[#e2e8f0] rounded-xl p-6 transition-all hover:shadow-md hover:border-[#cbd5e1] ${
                  isToday 
                    ? 'ring-2 ring-emerald-500/20 border-emerald-500/50' 
                    : ''
                }`}
              >
                {/* Completion indicator */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                <div className="text-3xl font-bold text-[#1c1f24] mb-2">
                  {day.day_index}
                </div>
                
                {dayTitle && (
                  <div className="text-sm text-[#64748b] line-clamp-2 mb-2">
                    {dayTitle}
                  </div>
                )}
                
                {isToday && (
                  <div className="mt-3 text-xs font-semibold text-emerald-600 uppercase tracking-wide">
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
