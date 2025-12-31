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
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg border">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="org_id" className="block text-sm font-medium mb-1">
            Organization *
          </label>
          <select
            id="org_id"
            value={formData.org_id}
            onChange={(e) => setFormData({ ...formData, org_id: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
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
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Event Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
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
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : budgetEvent ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
