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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Create Budget Event</h1>
        <p className="text-[#64748b]">Set up a new budget event to track expenses and revenue</p>
      </div>
      <BudgetEventForm organizations={organizations} />
    </div>
  );
}
