'use client';

import { useState } from 'react';
import { BudgetLineItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { ExpenseForm } from './ExpenseForm';

interface ExpensesClientProps {
  budgetEventId: string;
  lineItems: BudgetLineItem[];
  onUpdate: (items: BudgetLineItem[]) => void;
}

export function ExpensesClient({
  budgetEventId,
  lineItems: initialLineItems,
  onUpdate,
}: ExpensesClientProps) {
  const [lineItems, setLineItems] = useState(initialLineItems);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetLineItem | null>(null);

  // Group by category
  const groupedByCategory = lineItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetLineItem[]>);

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this line item?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('budget_line_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      const updated = lineItems.filter((item) => item.id !== itemId);
      setLineItems(updated);
      onUpdate(updated);
    } catch (err) {
      console.error('Error deleting line item:', err);
      alert('Error deleting line item');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    window.location.reload();
  };

  const calculateCategoryTotal = (items: BudgetLineItem[]) => {
    return {
      projected: items.reduce((sum, item) => sum + Number(item.projected_amount), 0),
      actual: items.reduce((sum, item) => sum + Number(item.actual_amount), 0),
      variance: items.reduce(
        (sum, item) => sum + (Number(item.actual_amount) - Number(item.projected_amount)),
        0
      ),
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#1c1f24]">Expenses</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Add Line Item
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ExpenseForm
            budgetEventId={budgetEventId}
            lineItem={editingItem || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      {Object.keys(groupedByCategory).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, items]) => {
            const totals = calculateCategoryTotal(items);
            return (
              <div key={category} className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#e2e8f0]">
                  <h3 className="text-lg font-semibold text-[#1c1f24]">{category}</h3>
                  <div className="text-sm text-[#64748b] flex gap-4">
                    <span>
                      Budgeted: <span className="font-semibold text-[#334e62]">${totals.projected.toLocaleString()}</span>
                    </span>
                    <span>
                      Actual: <span className="font-semibold text-[#334e62]">${totals.actual.toLocaleString()}</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        totals.variance > 0 ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      Variance: {totals.variance > 0 ? '+' : ''}
                      ${totals.variance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const variance = Number(item.actual_amount) - Number(item.projected_amount);
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4 bg-[#fafbfc] rounded-xl border border-[#e2e8f0] hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-[#1c1f24]">{item.description}</div>
                          {item.notes && (
                            <div className="text-sm text-[#64748b] mt-1">{item.notes}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-[#64748b]">
                              Budgeted: <span className="font-medium text-[#334e62]">${Number(item.projected_amount).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-[#64748b]">
                              Actual: <span className="font-medium text-[#334e62]">${Number(item.actual_amount).toLocaleString()}</span>
                            </div>
                            {variance !== 0 && (
                              <div
                                className={`text-sm font-semibold mt-1 ${
                                  variance > 0 ? 'text-red-600' : 'text-emerald-600'
                                }`}
                              >
                                {variance > 0 ? '+' : ''}${variance.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
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
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium mb-4">No expense line items yet.</p>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 font-medium"
          >
            Add Your First Line Item
          </button>
        </div>
      )}
    </div>
  );
}
