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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        {revenue ? 'Edit' : 'Add'} Revenue Item
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
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
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="pledge">Pledge</option>
            <option value="offering">Offering</option>
            <option value="other">Other</option>
          </select>
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

        {formData.type === 'pledge' && (
          <div>
            <label htmlFor="pledger_name" className="block text-sm font-medium mb-1">
              Pledger Name
            </label>
            <input
              id="pledger_name"
              type="text"
              value={formData.pledger_name}
              onChange={(e) =>
                setFormData({ ...formData, pledger_name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
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
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="received_amount" className="block text-sm font-medium mb-1">
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
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : revenue ? 'Update' : 'Create'}
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
