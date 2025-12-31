import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { BudgetEventOverview } from '@/components/budget/BudgetEventOverview';
import { BudgetEvent, BudgetLineItem, BudgetRevenue, AuditLog } from '@/lib/types';

export default async function BudgetEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get budget event
  const { data: budgetEvent } = await supabase
    .from('budget_events')
    .select('*')
    .eq('id', id)
    .single();

  if (!budgetEvent) {
    notFound();
  }

  // Get line items (expenses)
  const { data: lineItems } = await supabase
    .from('budget_line_items')
    .select('*')
    .eq('budget_event_id', id)
    .order('category', { ascending: true });

  // Get revenue
  const { data: revenue } = await supabase
    .from('budget_revenue')
    .select('*')
    .eq('budget_event_id', id)
    .order('created_at', { ascending: false });

  // Get audit logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .or(`table_name.eq.budget_line_items,table_name.eq.budget_revenue`)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <BudgetEventOverview
      budgetEvent={budgetEvent as BudgetEvent}
      lineItems={lineItems as BudgetLineItem[] || []}
      revenue={revenue as BudgetRevenue[] || []}
      auditLogs={auditLogs as AuditLog[] || []}
    />
  );
}
