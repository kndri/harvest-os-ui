-- Quick Data Verification Script
-- Run this in Supabase SQL Editor to verify all demo data is present

-- Summary counts
SELECT 
  'SUMMARY' as section,
  (SELECT COUNT(*) FROM programs) as programs,
  (SELECT COUNT(*) FROM program_days) as days,
  (SELECT COUNT(*) FROM program_events) as events,
  (SELECT COUNT(*) FROM speakers) as speakers,
  (SELECT COUNT(*) FROM resources) as resources,
  (SELECT COUNT(*) FROM prayer_requests) as prayer_requests_total,
  (SELECT COUNT(*) FROM prayer_requests WHERE is_approved = true) as prayer_requests_approved,
  (SELECT COUNT(*) FROM prayer_requests WHERE is_approved = false) as prayer_requests_pending,
  (SELECT COUNT(*) FROM budget_events) as budget_events,
  (SELECT COUNT(*) FROM budget_line_items) as expenses,
  (SELECT COUNT(*) FROM budget_revenue) as revenue_items;

-- Expected values:
-- programs: 3
-- days: 38 (21 + 5 + 12)
-- events: 8 (3 + 5)
-- speakers: 5
-- resources: 12 (6 + 2 + 4)
-- prayer_requests_total: 20
-- prayer_requests_approved: 14
-- prayer_requests_pending: 6
-- budget_events: 2
-- expenses: 11 (7 + 4)
-- revenue_items: 11 (7 + 4)

-- Detailed breakdown by program
SELECT 
  'PROGRAM BREAKDOWN' as section,
  p.slug,
  p.title_en,
  COUNT(DISTINCT pd.id) as days_count,
  COUNT(DISTINCT pe.id) as events_count,
  COUNT(DISTINCT r.id) as resources_count,
  COUNT(DISTINCT pr.id) as prayer_requests_count
FROM programs p
LEFT JOIN program_days pd ON pd.program_id = p.id
LEFT JOIN program_events pe ON pe.program_id = p.id
LEFT JOIN resources r ON r.program_id = p.id
LEFT JOIN prayer_requests pr ON pr.program_id = p.id
GROUP BY p.id, p.slug, p.title_en
ORDER BY p.slug;

-- Budget breakdown
SELECT 
  'BUDGET BREAKDOWN' as section,
  be.name,
  be.status,
  COUNT(DISTINCT bli.id) as expense_count,
  COUNT(DISTINCT br.id) as revenue_count,
  COALESCE(SUM(bli.projected_amount), 0) as total_projected_expenses,
  COALESCE(SUM(bli.actual_amount), 0) as total_actual_expenses,
  COALESCE(SUM(br.amount), 0) as total_revenue_pledged,
  COALESCE(SUM(br.received_amount), 0) as total_revenue_received
FROM budget_events be
LEFT JOIN budget_line_items bli ON bli.budget_event_id = be.id
LEFT JOIN budget_revenue br ON br.budget_event_id = be.id
GROUP BY be.id, be.name, be.status;
