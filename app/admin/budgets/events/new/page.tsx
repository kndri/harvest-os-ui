import { createServerClient } from '@/lib/supabase/server';
import { BudgetEventForm } from '@/components/budget/BudgetEventForm';
import { redirect } from 'next/navigation';

export default async function NewBudgetEventPage() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get user's organizations where they have finance or admin role
  const { data: memberships } = await supabase
    .from('org_memberships')
    .select('org_id, role, organizations(*)')
    .eq('user_id', user.id)
    .in('role', ['finance', 'admin']);

  if (!memberships || memberships.length === 0) {
    redirect('/admin/budgets');
  }

  const organizations = memberships.map(m => ({
    id: m.org_id,
    name: (m.organizations as any)?.name || 'Unknown',
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Budget Event</h1>
      <BudgetEventForm organizations={organizations} />
    </div>
  );
}
