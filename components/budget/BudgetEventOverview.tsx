'use client';

import { useState } from 'react';
import { BudgetEvent, BudgetLineItem, BudgetRevenue, AuditLog } from '@/lib/types';
import { ExpensesClient } from './ExpensesClient';
import { RevenueClient } from './RevenueClient';
import { AuditLogViewer } from './AuditLogViewer';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface BudgetEventOverviewProps {
  budgetEvent: BudgetEvent;
  lineItems: BudgetLineItem[];
  revenue: BudgetRevenue[];
  auditLogs: AuditLog[];
}

export function BudgetEventOverview({
  budgetEvent,
  lineItems: initialLineItems,
  revenue: initialRevenue,
  auditLogs: initialAuditLogs,
}: BudgetEventOverviewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expenses' | 'revenue' | 'audit'>('expenses');
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [revenue, setRevenue] = useState(initialRevenue);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Calculate totals
  const projected = lineItems.reduce((sum, item) => sum + Number(item.projected_amount), 0);
  const actual = lineItems.reduce((sum, item) => sum + Number(item.actual_amount), 0);
  const expensesTotal = {
    projected,
    actual,
    variance: actual - projected,
  };

  const revenueTotal = {
    pledged: revenue.reduce((sum, r) => sum + Number(r.amount), 0),
    received: revenue.reduce((sum, r) => sum + Number(r.received_amount), 0),
    balance: revenue.reduce((sum, r) => sum + Number(r.balance), 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/budgets')}
          className="text-sm text-[#64748b] hover:text-[#1c1f24] mb-4 font-medium transition-colors"
        >
          ← Back to Budget Events
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">{budgetEvent.name}</h1>
            {budgetEvent.description && (
              <p className="text-[#64748b] mt-1">{budgetEvent.description}</p>
            )}
            <div className="flex gap-4 text-sm text-[#64748b] mt-2">
              {budgetEvent.start_date && (
                <span>
                  📅 Start: {format(new Date(budgetEvent.start_date), 'MMM d, yyyy')}
                </span>
              )}
              {budgetEvent.end_date && (
                <span>
                  End: {format(new Date(budgetEvent.end_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              budgetEvent.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : budgetEvent.status === 'closed'
                ? 'bg-[#f2f4f6] text-[#64748b] border border-[#e2e8f0]'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {budgetEvent.status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748b] mb-2 uppercase tracking-wide">Expenses</h3>
          <div className="text-3xl font-bold text-[#1c1f24] mb-1">
            ${expensesTotal.actual.toLocaleString()}
          </div>
          <div className="text-sm text-[#64748b]">
            Budgeted: ${expensesTotal.projected.toLocaleString()}
          </div>
          {expensesTotal.variance !== 0 && (
            <div
              className={`text-sm mt-2 font-medium ${
                expensesTotal.variance > 0 ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {expensesTotal.variance > 0 ? '+' : ''}
              ${expensesTotal.variance.toLocaleString()} variance
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748b] mb-2 uppercase tracking-wide">Revenue</h3>
          <div className="text-3xl font-bold text-[#1c1f24] mb-1">
            ${revenueTotal.received.toLocaleString()}
          </div>
          <div className="text-sm text-[#64748b]">
            Pledged: ${revenueTotal.pledged.toLocaleString()}
          </div>
          {revenueTotal.balance > 0 && (
            <div className="text-sm text-[#64748b] mt-2">
              Balance: ${revenueTotal.balance.toLocaleString()}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-sm font-semibold text-[#64748b] mb-2 uppercase tracking-wide">Net</h3>
          <div
            className={`text-3xl font-bold ${
              revenueTotal.received - expensesTotal.actual >= 0
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            ${(revenueTotal.received - expensesTotal.actual).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0] mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'expenses'
                ? 'border-emerald-500 text-[#1c1f24]'
                : 'border-transparent text-[#64748b] hover:text-[#1c1f24]'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'revenue'
                ? 'border-emerald-500 text-[#1c1f24]'
                : 'border-transparent text-[#64748b] hover:text-[#1c1f24]'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-500 text-[#1c1f24]'
                : 'border-transparent text-[#64748b] hover:text-[#1c1f24]'
            }`}
          >
            Audit Log
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'expenses' && (
        <ExpensesClient
          budgetEventId={budgetEvent.id}
          lineItems={lineItems}
          onUpdate={(items) => {
            setLineItems(items);
            router.refresh();
          }}
        />
      )}
      {activeTab === 'revenue' && (
        <RevenueClient
          budgetEventId={budgetEvent.id}
          revenue={revenue}
          onUpdate={(rev) => {
            setRevenue(rev);
            router.refresh();
          }}
        />
      )}
      {activeTab === 'audit' && (
        <AuditLogViewer
          auditLogs={auditLogs}
          lineItems={lineItems}
          revenue={revenue}
        />
      )}
    </div>
  );
}
