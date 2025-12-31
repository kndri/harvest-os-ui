'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BudgetLineItem } from '@/lib/types';

interface ExpenseFormProps {
  budgetEventId: string;
  lineItem?: BudgetLineItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExpenseForm({
  budgetEventId,
  lineItem,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: lineItem?.category || '',
    description: lineItem?.description || '',
    projected_amount: lineItem?.projected_amount || 0,
    actual_amount: lineItem?.actual_amount || 0,
    notes: lineItem?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const data = {
        budget_event_id: budgetEventId,
        category: formData.category,
        description: formData.description,
        projected_amount: formData.projected_amount,
        actual_amount: formData.actual_amount,
        notes: formData.notes || null,
      };

      if (lineItem) {
        const { error } = await supabase
          .from('budget_line_items')
          .update(data)
          .eq('id', lineItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budget_line_items')
          .insert(data);

        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        {lineItem ? 'Edit' : 'Add'} Expense Line Item
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category *
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
            placeholder="e.g., Venue, Catering, Marketing"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="projected_amount" className="block text-sm font-medium mb-1">
              Projected Amount *
            </label>
            <input
              id="projected_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.projected_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  projected_amount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="actual_amount" className="block text-sm font-medium mb-1">
              Actual Amount *
            </label>
            <input
              id="actual_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.actual_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  actual_amount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : lineItem ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
