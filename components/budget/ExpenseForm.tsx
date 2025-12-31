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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
      <h3 className="text-lg font-semibold text-[#1c1f24] mb-6">
        {lineItem ? 'Edit' : 'Add'} Expense Line Item
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-[#334e62] mb-2">
            Category *
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
            placeholder="e.g., Venue, Catering, Marketing"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[#334e62] mb-2">
            Description *
          </label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="projected_amount" className="block text-sm font-semibold text-[#334e62] mb-2">
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
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="actual_amount" className="block text-sm font-semibold text-[#334e62] mb-2">
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
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-[#334e62] mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
            rows={3}
          />
        </div>

        <div className="flex gap-4 pt-5 border-t border-[#e2e8f0]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 font-medium"
          >
            {loading ? 'Saving...' : lineItem ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-[#f2f4f6] text-[#334e62] rounded-xl hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
