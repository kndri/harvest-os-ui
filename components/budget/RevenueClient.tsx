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
        <h2 className="text-xl font-semibold">Revenue</h2>
        <button
          onClick={() => {
            setEditingRevenue(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Revenue Item
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
              className="bg-white border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                    <h3 className="font-semibold">{item.description}</h3>
                  </div>
                  {item.pledger_name && (
                    <p className="text-sm text-gray-600">Pledger: {item.pledger_name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRevenue(item);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="text-lg font-semibold">
                    ${Number(item.amount).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Received</div>
                  <div className="text-lg font-semibold">
                    ${Number(item.received_amount).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Balance</div>
                  <div
                    className={`text-lg font-semibold ${
                      Number(item.balance) > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}
                  >
                    ${Number(item.balance).toLocaleString()}
                  </div>
                </div>
              </div>

              {item.type === 'pledge' && Number(item.balance) > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleRecordPayment(item.id, Number(item.received_amount))}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Record Payment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600 mb-4">No revenue items yet.</p>
          <button
            onClick={() => {
              setEditingRevenue(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Revenue Item
          </button>
        </div>
      )}
    </div>
  );
}
