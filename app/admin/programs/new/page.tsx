import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProgramForm } from './ProgramForm';

export default async function NewProgramPage() {
  const supabase = await createServerClient();
  
  // Get user's first org membership
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: membership } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">You need to be part of an organization to create programs.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Create New Program</h1>
      <ProgramForm orgId={membership.org_id} />
    </div>
  );
}
