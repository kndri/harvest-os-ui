// Program types
export interface Program {
  id: string;
  org_id: string;
  slug: string;
  title_en: string;
  title_fr: string | null;
  description_en: string | null;
  description_fr: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  is_dated: boolean;
  config: ProgramConfig;
  branding: ProgramBranding;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ProgramConfig {
  resources: boolean;
  prayer_wall: boolean;
  events: boolean;
  speakers: boolean;
}

export interface ProgramBranding {
  primary_color?: string;
  secondary_color?: string;
  banner_url?: string;
  logo_url?: string;
}

export interface ProgramDay {
  id: string;
  program_id: string;
  day_index: number;
  title_en: string | null;
  title_fr: string | null;
  devotional_en: string | null;
  devotional_fr: string | null;
  scriptures_en: string[] | null;
  scriptures_fr: string[] | null;
  prayer_focus_en: string | null;
  prayer_focus_fr: string | null;
  fasting_focus_en: string | null;
  fasting_focus_fr: string | null;
  activities_en: string | null;
  activities_fr: string | null;
  reflection_questions_en: string[] | null;
  reflection_questions_fr: string[] | null;
  family_guide_en: string | null;
  family_guide_fr: string | null;
  media_urls: string[] | null;
  notes_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDayProgress {
  id: string;
  user_id: string;
  program_day_id: string;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  total_days: number;
  completed_days: number;
  completion_percentage: number;
}

export type Locale = 'en' | 'fr';
