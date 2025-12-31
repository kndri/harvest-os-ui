'use client';

import { useState } from 'react';
import { BudgetRevenue } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { RevenueForm } from './RevenueForm';

interface RevenueClientProps {
  budgetEventId: string;
  revenue: BudgetRevenue[];
  onUpdate: (revenue: BudgetRevenue[]) => void;
}

export function RevenueClient({
  budgetEventId,
  revenue: initialRevenue,
  onUpdate,
}: RevenueClientProps) {
  const [revenue, setRevenue] = useState(initialRevenue);
  const [showForm, setShowForm] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<BudgetRevenue | null>(null);

  const handleDelete = async (revenueId: string) => {
    if (!confirm('Are you sure you want to delete this revenue item?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('budget_revenue')
        .delete()
        .eq('id', revenueId);

      if (error) throw error;

      const updated = revenue.filter((r) => r.id !== revenueId);
      setRevenue(updated);
      onUpdate(updated);
    } catch (err) {
      console.error('Error deleting revenue:', err);
      alert('Error deleting revenue');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRevenue(null);
    window.location.reload();
  };

  const handleRecordPayment = async (revenueId: string, currentReceived: number) => {
    const amountStr = prompt('Enter payment amount:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('budget_revenue')
        .update({ received_amount: currentReceived + amount })
        .eq('id', revenueId);

      if (error) throw error;

      const updated = revenue.map((r) =>
        r.id === revenueId
          ? { ...r, received_amount: currentReceived + amount, balance: Number(r.amount) - (currentReceived + amount) }
          : r
      );
      setRevenue(updated);
      onUpdate(updated);
    } catch (err) {
      console.error('Error recording payment:', err);
      alert('Error recording payment');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1c1f24]">Revenue</h2>
        <button
          onClick={() => {
            setEditingRevenue(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Add Revenue Item
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <RevenueForm
            budgetEventId={budgetEventId}
            revenue={editingRevenue || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingRevenue(null);
            }}
          />
        </div>
      )}

      {revenue.length > 0 ? (
        <div className="space-y-4">
          {revenue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#e2e8f0]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-[#1c1f24]">{item.description}</h3>
                  </div>
                  {item.pledger_name && (
                    <p className="text-sm text-[#64748b]">Pledger: <span className="font-medium text-[#334e62]">{item.pledger_name}</span></p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRevenue(item);
                      setShowForm(true);
                    }}
                    className="px-3 py-1.5 text-sm bg-[#f2f4f6] text-[#334e62] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-[#64748b] mb-1">Amount</div>
                  <div className="text-xl font-semibold text-[#1c1f24]">
                    ${Number(item.amount).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#64748b] mb-1">Received</div>
                  <div className="text-xl font-semibold text-[#1c1f24]">
                    ${Number(item.received_amount).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#64748b] mb-1">Balance</div>
                  <div
                    className={`text-xl font-semibold ${
                      Number(item.balance) > 0 ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    ${Number(item.balance).toLocaleString()}
                  </div>
                </div>
              </div>

              {item.type === 'pledge' && Number(item.balance) > 0 && (
                <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                  <button
                    onClick={() => handleRecordPayment(item.id, Number(item.received_amount))}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md font-medium"
                  >
                    Record Payment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium mb-4">No revenue items yet.</p>
          <button
            onClick={() => {
              setEditingRevenue(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 font-medium"
          >
            Add Your First Revenue Item
          </button>
        </div>
      )}
    </div>
  );
}
