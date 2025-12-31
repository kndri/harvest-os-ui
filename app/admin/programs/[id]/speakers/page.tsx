import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { SpeakersAdminClient } from '@/components/admin/SpeakersAdminClient';
import { ProgramSubNav } from '@/components/admin/ProgramSubNav';
import { Program } from '@/lib/types';

export default async function SpeakersAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get speakers for this org
  const { data: speakers } = await supabase
    .from('speakers')
    .select('*')
    .eq('org_id', program.org_id)
    .order('name', { ascending: true });
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <ProgramSubNav program={program as Program} currentSection="Speakers" />
      <SpeakersAdminClient
        speakers={speakers || []}
        orgId={program.org_id}
      />
    </div>
  );
}
