import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PrayerModerationClient } from '@/components/prayer/PrayerModerationClient';
import { PrayerRequest } from '@/lib/types';

export default async function PrayerModerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createServerClient();
  
  // Get program
  const { data: program } = await supabase
    .from('programs')
    .select('id, title_en, title_fr')
    .eq('id', id)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get pending prayer requests
  const { data: pendingRequests } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('program_id', id)
    .eq('is_approved', false)
    .order('created_at', { ascending: false });
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Prayer Request Moderation - {program.title_en}
      </h1>
      <PrayerModerationClient
        requests={pendingRequests || []}
        programId={id}
      />
    </div>
  );
}
