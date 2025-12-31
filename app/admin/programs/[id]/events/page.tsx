import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EventsAdminClient } from '@/components/admin/EventsAdminClient';
import { ProgramEvent } from '@/lib/types';

export default async function EventsAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('id, title_en, title_fr, org_id')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get events
  const { data: events } = await supabase
    .from('program_events')
    .select(`
      *,
      speaker:speakers(*)
    `)
    .eq('program_id', id)
    .order('starts_at', { ascending: true });
  
  // Get speakers for this org
  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('org_id', program.org_id)
    .order('name', { ascending: true });
  
  return (
    <EventsAdminClient
      events={events || []}
      speakers={speakers || []}
      programId={id}
    />
  );
}
