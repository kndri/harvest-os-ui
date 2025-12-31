'use client';

import { useState } from 'react';
import { AuditLog, BudgetLineItem, BudgetRevenue } from '@/lib/types';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
  lineItems: BudgetLineItem[];
  revenue: BudgetRevenue[];
}

export function AuditLogViewer({
  auditLogs: initialLogs,
  lineItems,
  revenue,
}: AuditLogViewerProps) {
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const [fieldFilter, setFieldFilter] = useState<string>('all');

  // Create lookup maps
  const lineItemMap = new Map(lineItems.map((item) => [item.id, item]));
  const revenueMap = new Map(revenue.map((r) => [r.id, r]));

  // Filter logs
  let filteredLogs = initialLogs;

  if (dateFilter.from) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.created_at) >= new Date(dateFilter.from)
    );
  }

  if (dateFilter.to) {
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.created_at) <= new Date(dateFilter.to)
    );
  }

  if (fieldFilter !== 'all') {
    filteredLogs = filteredLogs.filter((log) => log.field_name === fieldFilter);
  }

  const getRecordDescription = (log: AuditLog) => {
    if (log.table_name === 'budget_line_items') {
      const item = lineItemMap.get(log.record_id);
      return item ? `${item.category} - ${item.description}` : 'Unknown line item';
    } else if (log.table_name === 'budget_revenue') {
      const rev = revenueMap.get(log.record_id);
      return rev ? rev.description : 'Unknown revenue item';
    }
    return 'Unknown record';
  };

  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      projected_amount: 'Projected Amount',
      actual_amount: 'Actual Amount',
      amount: 'Amount',
      received_amount: 'Received Amount',
    };
    return labels[fieldName] || fieldName;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Audit Log</h2>
        <div className="flex gap-4">
          <div>
            <label htmlFor="date_from" className="block text-xs text-gray-600 mb-1">
              From
            </label>
            <input
              id="date_from"
              type="date"
              value={dateFilter.from}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, from: e.target.value })
              }
              className="px-3 py-1 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label htmlFor="date_to" className="block text-xs text-gray-600 mb-1">
              To
            </label>
            <input
              id="date_to"
              type="date"
              value={dateFilter.to}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, to: e.target.value })
              }
              className="px-3 py-1 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label htmlFor="field_filter" className="block text-xs text-gray-600 mb-1">
              Field
            </label>
            <select
              id="field_filter"
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="all">All Fields</option>
              <option value="projected_amount">Projected Amount</option>
              <option value="actual_amount">Actual Amount</option>
              <option value="amount">Amount</option>
              <option value="received_amount">Received Amount</option>
            </select>
          </div>
        </div>
      </div>

      {filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-600 mb-1">
                    {getRecordDescription(log)}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{getFieldLabel(log.field_name)}</span>
                    {' changed from '}
                    <span className="text-red-600">
                      {log.old_value ? `$${Number(log.old_value).toLocaleString()}` : 'N/A'}
                    </span>
                    {' to '}
                    <span className="text-green-600">
                      {log.new_value ? `$${Number(log.new_value).toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">No audit logs found.</p>
        </div>
      )}
    </div>
  );
}
