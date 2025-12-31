import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PrayerWallClient } from '@/components/prayer/PrayerWallClient';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function PrayerWallPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  
  const supabase = await createServerClient();
  
  // Get program first
  const { data: program } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Get approved prayer requests
  const { data: requests } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('program_id', program.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  
  const { user } = await getCurrentUser();
  
  // Get user's prayer log if authenticated
  let prayedRequestIds: string[] = [];
  if (user) {
    const { data: prayerLog } = await supabase
      .from('prayer_prayed_log')
      .select('prayer_request_id')
      .eq('user_id', user.id);
    
    prayedRequestIds = prayerLog?.map((log) => log.prayer_request_id) || [];
  }
  
  return (
    <PrayerWallClient
      requests={requests || []}
      programId={program.id}
      locale={locale}
      userId={user?.id || null}
      prayedRequestIds={prayedRequestIds}
    />
  );
}
