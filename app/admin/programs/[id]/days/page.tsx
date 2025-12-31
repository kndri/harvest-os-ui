import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { DaysAdminClient } from '@/components/admin/DaysAdminClient';
import { ProgramDay } from '@/types';

export default async function DaysAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('id, slug, title_en, title_fr, duration_days')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get program days
  const { data: days } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', id)
    .order('day_index', { ascending: true });
  
  return (
    <DaysAdminClient
      days={days || []}
      programId={id}
      programSlug={program.slug}
      programTitle={program.title_en}
      durationDays={program.duration_days}
    />
  );
}
