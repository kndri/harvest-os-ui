import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EditProgramForm } from './EditProgramForm';
import { Program } from '@/types';

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Program</h1>
      <EditProgramForm program={program as Program} />
    </div>
  );
}
