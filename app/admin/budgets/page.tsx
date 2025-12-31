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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-4">Budget Events</h1>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
            <p>You don't have access to any organizations with budget permissions.</p>
          </div>
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
