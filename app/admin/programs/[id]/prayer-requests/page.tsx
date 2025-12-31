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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">
          Prayer Request Moderation
        </h1>
        <p className="text-[#64748b]">{program.title_en}</p>
      </div>
      <PrayerModerationClient
        requests={pendingRequests || []}
        programId={id}
      />
    </div>
  );
}
