import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DayContent, ProgramNav } from '@/components/programs';
import { DayActions } from './DayActions';
import { ProgramDay, Locale, UserDayProgress, Program } from '@/types';

export default async function DayPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string; dayIndex: string }>;
}) {
  const { lang, slug, dayIndex } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const supabase = await createServerClient();
  const dayNum = parseInt(dayIndex);
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }

  // Get the specific day
  const { data: day } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', program.id)
    .eq('day_index', dayNum)
    .single();
  
  if (!day) {
    notFound();
  }

  // Get user progress if logged in
  const { data: { user } } = await supabase.auth.getUser();
  let progress: UserDayProgress | null = null;
  
  if (user) {
    const { data: progressData } = await supabase
      .from('user_day_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('program_day_id', day.id)
      .single();
    
    progress = progressData as UserDayProgress | null;
  }

  // Get adjacent days for navigation
  const { data: allDays } = await supabase
    .from('program_days')
    .select('day_index')
    .eq('program_id', program.id)
    .order('day_index', { ascending: true });

  const dayIndices = allDays?.map(d => d.day_index) || [];
  const currentIndex = dayIndices.indexOf(dayNum);
  const prevDay = currentIndex > 0 ? dayIndices[currentIndex - 1] : null;
  const nextDay = currentIndex < dayIndices.length - 1 ? dayIndices[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white">
      <ProgramNav program={program as Program} locale={locale} />
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Day Content with Actions */}
        {user ? (
          <DayActions 
            day={day as ProgramDay} 
            locale={locale} 
            initialProgress={progress}
          />
        ) : (
          <DayContent 
            day={day as ProgramDay} 
            locale={locale}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-[#e2e8f0]">
          {prevDay ? (
            <Link 
              href={`/${locale}/programs/${slug}/days/${prevDay}`}
              className="flex items-center gap-2 text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'fr' ? 'Jour' : 'Day'} {prevDay}
            </Link>
          ) : <div />}
          
          <Link 
            href={`/${locale}/programs/${slug}`}
            className="text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium"
          >
            {locale === 'fr' ? 'Tous les jours' : 'All Days'}
          </Link>
          
          {nextDay ? (
            <Link 
              href={`/${locale}/programs/${slug}/days/${nextDay}`}
              className="flex items-center gap-2 text-[#64748b] hover:text-[#1c1f24] transition-colors font-medium"
            >
              {locale === 'fr' ? 'Jour' : 'Day'} {nextDay}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
