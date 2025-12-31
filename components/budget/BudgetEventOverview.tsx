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
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/budgets')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Budget Events
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{budgetEvent.name}</h1>
            {budgetEvent.description && (
              <p className="text-gray-600 mt-1">{budgetEvent.description}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {budgetEvent.start_date && (
                <span>
                  Start: {format(new Date(budgetEvent.start_date), 'MMM d, yyyy')}
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
            className={`px-3 py-1 text-sm font-semibold rounded ${getStatusColor(
              budgetEvent.status
            )}`}
          >
            {budgetEvent.status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Expenses</h3>
          <div className="text-2xl font-bold">
            ${expensesTotal.actual.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Budgeted: ${expensesTotal.projected.toLocaleString()}
          </div>
          {expensesTotal.variance !== 0 && (
            <div
              className={`text-sm mt-1 ${
                expensesTotal.variance > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {expensesTotal.variance > 0 ? '+' : ''}
              ${expensesTotal.variance.toLocaleString()} variance
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Revenue</h3>
          <div className="text-2xl font-bold">
            ${revenueTotal.received.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Pledged: ${revenueTotal.pledged.toLocaleString()}
          </div>
          {revenueTotal.balance > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              Balance: ${revenueTotal.balance.toLocaleString()}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Net</h3>
          <div
            className={`text-2xl font-bold ${
              revenueTotal.received - expensesTotal.actual >= 0
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            ${(revenueTotal.received - expensesTotal.actual).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-2 px-1 border-b-2 ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-2 px-1 border-b-2 ${
              activeTab === 'revenue'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2 px-1 border-b-2 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
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
