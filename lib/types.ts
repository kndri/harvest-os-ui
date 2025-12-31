// Database types for task-03 features

export interface Speaker {
  id: string;
  org_id: string;
  name: string;
  bio_en: string | null;
  bio_fr: string | null;
  photo_url: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramEvent {
  id: string;
  program_id: string;
  title_en: string;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  starts_at: string;
  ends_at: string | null;
  speaker_id: string | null;
  location: string | null;
  livestream_url: string | null;
  created_at: string;
  updated_at: string;
  speaker?: Speaker;
}

export interface PrayerRequest {
  id: string;
  program_id: string;
  user_id: string | null;
  content: string;
  is_anonymous: boolean;
  is_approved: boolean;
  prayed_count: number;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
}

export interface Resource {
  id: string;
  program_id: string;
  title_en: string;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  category: string | null;
  language: 'en' | 'fr' | 'both';
  storage_path: string;
  file_type: string | null;
  file_size: number | null;
  download_count: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface BudgetEvent {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'draft' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface BudgetLineItem {
  id: string;
  budget_event_id: string;
  category: string;
  description: string;
  projected_amount: number;
  actual_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetRevenue {
  id: string;
  budget_event_id: string;
  type: 'pledge' | 'offering' | 'other';
  description: string;
  amount: number;
  received_amount: number;
  balance: number;
  pledger_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BudgetAttachment {
  id: string;
  budget_event_id: string;
  line_item_id: string | null;
  revenue_id: string | null;
  file_name: string;
  storage_path: string;
  file_type: string | null;
  file_size: number | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  user_id: string | null;
  created_at: string;
}
