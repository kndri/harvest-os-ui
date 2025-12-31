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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget Events</h1>
        <button
          onClick={() => router.push('/admin/budgets/events/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Budget Event
        </button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/budgets/events/${event.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                {event.start_date && (
                  <span>
                    Start: {format(new Date(event.start_date), 'MMM d, yyyy')}
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
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600 mb-4">No budget events yet.</p>
          <button
            onClick={() => router.push('/admin/budgets/events/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Budget Event
          </button>
        </div>
      )}
    </div>
  );
}
