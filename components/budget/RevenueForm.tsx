'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BudgetRevenue } from '@/lib/types';

interface RevenueFormProps {
  budgetEventId: string;
  revenue?: BudgetRevenue;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RevenueForm({
  budgetEventId,
  revenue,
  onSuccess,
  onCancel,
}: RevenueFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: (revenue?.type || 'pledge') as 'pledge' | 'offering' | 'other',
    description: revenue?.description || '',
    amount: revenue?.amount || 0,
    received_amount: revenue?.received_amount || 0,
    pledger_name: revenue?.pledger_name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const data = {
        budget_event_id: budgetEventId,
        type: formData.type,
        description: formData.description,
        amount: formData.amount,
        received_amount: formData.received_amount,
        pledger_name: formData.type === 'pledge' ? formData.pledger_name || null : null,
      };

      if (revenue) {
        const { error } = await supabase
          .from('budget_revenue')
          .update(data)
          .eq('id', revenue.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('budget_revenue')
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
        {revenue ? 'Edit' : 'Add'} Revenue Item
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="type" className="block text-sm font-semibold text-[#334e62] mb-2">
            Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as 'pledge' | 'offering' | 'other',
              })
            }
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
          >
            <option value="pledge">Pledge</option>
            <option value="offering">Offering</option>
            <option value="other">Other</option>
          </select>
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

        {formData.type === 'pledge' && (
          <div>
            <label htmlFor="pledger_name" className="block text-sm font-semibold text-[#334e62] mb-2">
              Pledger Name
            </label>
            <input
              id="pledger_name"
              type="text"
              value={formData.pledger_name}
              onChange={(e) =>
                setFormData({ ...formData, pledger_name: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-[#334e62] mb-2">
              Amount *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="received_amount" className="block text-sm font-semibold text-[#334e62] mb-2">
              Received Amount *
            </label>
            <input
              id="received_amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.received_amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  received_amount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-5 border-t border-[#e2e8f0]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 font-medium"
          >
            {loading ? 'Saving...' : revenue ? 'Update' : 'Create'}
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
