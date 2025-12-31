'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProgram(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const orgId = formData.get('org_id') as string;
  
  const { data, error } = await supabase
    .from('programs')
    .insert({
      title_en: formData.get('title_en') as string,
      title_fr: formData.get('title_fr') as string || null,
      description_en: formData.get('description_en') as string || null,
      description_fr: formData.get('description_fr') as string || null,
      slug: formData.get('slug') as string,
      org_id: orgId,
      duration_days: formData.get('duration_days') ? parseInt(formData.get('duration_days') as string) : null,
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
      is_dated: formData.get('is_dated') === 'true',
      config: {
        resources: formData.get('config.resources') === 'on',
        prayer_wall: formData.get('config.prayer_wall') === 'on',
        events: formData.get('config.events') === 'on',
        speakers: formData.get('config.speakers') === 'on',
      },
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/programs');
  return { success: true, data };
}

export async function updateProgram(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('programs')
    .update({
      title_en: formData.get('title_en') as string,
      title_fr: formData.get('title_fr') as string || null,
      description_en: formData.get('description_en') as string || null,
      description_fr: formData.get('description_fr') as string || null,
      slug: formData.get('slug') as string,
      duration_days: formData.get('duration_days') ? parseInt(formData.get('duration_days') as string) : null,
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
      is_dated: formData.get('is_dated') === 'true',
      config: {
        resources: formData.get('config.resources') === 'on',
        prayer_wall: formData.get('config.prayer_wall') === 'on',
        events: formData.get('config.events') === 'on',
        speakers: formData.get('config.speakers') === 'on',
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/programs');
  return { success: true };
}

export async function publishProgram(id: string) {
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from('programs')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/programs');
  revalidatePath('/en');
  revalidatePath('/fr');
  return { success: true };
}

export async function archiveProgram(id: string) {
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from('programs')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/programs');
  return { success: true };
}

export async function markDayComplete(programDayId: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .rpc('mark_day_complete', { p_program_day_id: programDayId });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}

export async function saveDayNotes(programDayId: string, notes: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .rpc('save_day_notes', { p_program_day_id: programDayId, p_notes: notes });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}
