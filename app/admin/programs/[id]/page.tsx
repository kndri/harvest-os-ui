import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { EditProgramForm } from './EditProgramForm';
import { ProgramSubNav } from '@/components/admin/ProgramSubNav';
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
      <ProgramSubNav program={program as Program} currentSection="Settings" />
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1c1f24] mb-4">Program Settings</h2>
        <EditProgramForm program={program as Program} />
      </div>
    </div>
  );
}
