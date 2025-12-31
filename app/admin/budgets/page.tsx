import { createServerClient } from '@/lib/supabase/server';
import { BudgetEventsClient } from '@/components/budget/BudgetEventsClient';
import { BudgetEvent } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function BudgetsPage() {
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
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Budget Events</h1>
        <p className="text-gray-600">You don't have access to any organizations with budget permissions.</p>
      </div>
    );
  }

  // Get budget events for all accessible orgs
  const orgIds = memberships.map(m => m.org_id);
  const { data: budgetEvents } = await supabase
    .from('budget_events')
    .select('*')
    .in('org_id', orgIds)
    .order('created_at', { ascending: false });

  return (
    <BudgetEventsClient
      budgetEvents={budgetEvents as BudgetEvent[] || []}
      organizations={memberships.map(m => ({
        id: m.org_id,
        name: (m.organizations as any)?.name || 'Unknown',
      }))}
    />
  );
}
