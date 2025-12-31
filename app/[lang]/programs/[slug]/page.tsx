import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProgramOverview, ProgramNav } from '@/components/programs';
import { Program, ProgramDay, Locale, UserDayProgress } from '@/types';

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }

  // Check access - must be published for public access
  const { data: { user } } = await supabase.auth.getUser();
  
  if (program.status !== 'published' && !user) {
    notFound();
  }

  // Get program days
  const { data: days } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', program.id)
    .order('day_index', { ascending: true });

  // Calculate today's day index for dated programs
  let todayIndex: number | undefined;
  if (program.is_dated && program.start_date) {
    const startDate = new Date(program.start_date);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays >= 1 && diffDays <= (program.duration_days || 999)) {
      todayIndex = diffDays;
    }
  }

  // Get user progress if logged in
  let userProgress: { [dayId: string]: UserDayProgress } = {};
  if (user && days) {
    const dayIds = days.map(d => d.id);
    const { data: progressData } = await supabase
      .from('user_day_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('program_day_id', dayIds);
    
    if (progressData) {
      userProgress = progressData.reduce((acc, p) => {
        acc[p.program_day_id] = p as UserDayProgress;
        return acc;
      }, {} as { [dayId: string]: UserDayProgress });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ProgramNav program={program as Program} locale={locale} />
      <ProgramOverview 
        program={program as Program}
        days={(days || []) as ProgramDay[]}
        locale={locale}
        todayIndex={todayIndex}
        userProgress={userProgress}
      />
    </div>
  );
}
