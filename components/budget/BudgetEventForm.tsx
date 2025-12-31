'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface BudgetEventFormProps {
  organizations: Array<{ id: string; name: string }>;
  budgetEvent?: {
    id: string;
    org_id: string;
    name: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    status: 'draft' | 'active' | 'closed';
  };
}

export function BudgetEventForm({
  organizations,
  budgetEvent,
}: BudgetEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    org_id: budgetEvent?.org_id || organizations[0]?.id || '',
    name: budgetEvent?.name || '',
    description: budgetEvent?.description || '',
    start_date: budgetEvent?.start_date || '',
    end_date: budgetEvent?.end_date || '',
    status: budgetEvent?.status || 'draft',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const data = {
        org_id: formData.org_id,
        name: formData.name,
        description: formData.description || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status,
      };

      if (budgetEvent) {
        // Update
        const { error } = await supabase
          .from('budget_events')
          .update(data)
          .eq('id', budgetEvent.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('budget_events')
          .insert(data);

        if (error) throw error;
      }

      router.push('/admin/budgets');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-8 rounded-2xl border border-[#e2e8f0] shadow-sm">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="org_id" className="block text-sm font-semibold text-[#334e62] mb-2">
            Organization *
          </label>
          <select
            id="org_id"
            value={formData.org_id}
            onChange={(e) => setFormData({ ...formData, org_id: e.target.value })}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
            disabled={!!budgetEvent}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#334e62] mb-2">
            Event Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-[#334e62] mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-semibold text-[#334e62] mb-2">
              Start Date
            </label>
            <input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-semibold text-[#334e62] mb-2">
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-[#334e62] mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'draft' | 'active' | 'closed',
              })
            }
            className="w-full px-4 py-3 bg-[#f2f4f6] border border-[#e2e8f0] rounded-xl text-[#1c1f24] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex gap-4 pt-6 border-t border-[#e2e8f0]">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 font-medium"
          >
            {loading ? 'Saving...' : budgetEvent ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#f2f4f6] text-[#334e62] rounded-xl hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
