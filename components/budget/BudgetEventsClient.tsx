'use client';

import { useState } from 'react';
import { BudgetEvent } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface BudgetEventsClientProps {
  budgetEvents: BudgetEvent[];
  organizations: Array<{ id: string; name: string }>;
}

export function BudgetEventsClient({
  budgetEvents: initialEvents,
  organizations,
}: BudgetEventsClientProps) {
  const router = useRouter();
  const [events] = useState(initialEvents);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Budget Events</h1>
          <p className="text-[#64748b]">Track expenses and revenue for church events</p>
        </div>
        <button
          onClick={() => router.push('/admin/budgets/events/new')}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Create Budget Event
        </button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-[#e2e8f0] rounded-xl p-6 bg-white hover:shadow-lg transition-all cursor-pointer"
              onClick={() => router.push(`/admin/budgets/events/${event.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1c1f24]">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-[#64748b] mt-1">{event.description}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    event.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : event.status === 'closed'
                      ? 'bg-[#f2f4f6] text-[#64748b] border border-[#e2e8f0]'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-[#64748b] mt-2">
                {event.start_date && (
                  <span>
                    📅 Start: {format(new Date(event.start_date), 'MMM d, yyyy')}
                  </span>
                )}
                {event.end_date && (
                  <span>
                    End: {format(new Date(event.end_date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium mb-4">No budget events yet.</p>
          <button
            onClick={() => router.push('/admin/budgets/events/new')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 font-medium"
          >
            Create Your First Budget Event
          </button>
        </div>
      )}
    </div>
  );
}
