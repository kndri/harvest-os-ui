import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ResourcesAdminClient } from '@/components/admin/ResourcesAdminClient';
import { Resource } from '@/lib/types';

export default async function ResourcesAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('id, title_en, title_fr')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('program_id', id)
    .order('created_at', { ascending: false });
  
  return (
    <ResourcesAdminClient
      resources={resources || []}
      programId={id}
    />
  );
}
