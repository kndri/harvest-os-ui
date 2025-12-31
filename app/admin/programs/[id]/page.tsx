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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Edit Program</h1>
        <p className="text-[#64748b]">Update program details and settings</p>
      </div>
      <EditProgramForm program={program as Program} />
    </div>
  );
}
