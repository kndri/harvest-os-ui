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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-center">
            <p>You need to be part of an organization to create programs.</p>
          </div>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Create New Program</h1>
        <p className="text-[#64748b]">Set up a new program for your church</p>
      </div>
      <ProgramForm orgId={membership.org_id} />
    </div>
  );
}
