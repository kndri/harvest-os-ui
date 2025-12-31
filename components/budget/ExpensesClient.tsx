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
        <h2 className="text-xl font-semibold">Expenses</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Line Item
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
              <div key={category} className="bg-white border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">
                      Budgeted: ${totals.projected.toLocaleString()}
                    </span>
                    <span className="mr-4">
                      Actual: ${totals.actual.toLocaleString()}
                    </span>
                    <span
                      className={
                        totals.variance > 0 ? 'text-red-600' : 'text-green-600'
                      }
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
                        className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{item.description}</div>
                          {item.notes && (
                            <div className="text-sm text-gray-600 mt-1">{item.notes}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              Budgeted: ${Number(item.projected_amount).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Actual: ${Number(item.actual_amount).toLocaleString()}
                            </div>
                            {variance !== 0 && (
                              <div
                                className={`text-sm font-medium ${
                                  variance > 0 ? 'text-red-600' : 'text-green-600'
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
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600 mb-4">No expense line items yet.</p>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Line Item
          </button>
        </div>
      )}
    </div>
  );
}
