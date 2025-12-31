import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ResourcesClient } from '@/components/resources/ResourcesClient';
import { ProgramNav } from '@/components/programs';
import { Resource, Program } from '@/lib/types';

export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { lang, slug } = await params;
  const { category } = await searchParams;
  const locale = (lang === 'fr' ? 'fr' : 'en') as 'en' | 'fr';
  
  const supabase = await createServerClient();
  
  // Get program first
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!program) {
    notFound();
  }
  
  // Build query
  let query = supabase
    .from('resources')
    .select('*')
    .eq('program_id', program.id);
  
  // Filter by language
  if (locale === 'fr') {
    query = query.or('language.eq.fr,language.eq.both');
  } else {
    query = query.or('language.eq.en,language.eq.both');
  }
  
  // Filter by category if provided
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  const { data: resources } = await query.order('created_at', { ascending: false });
  
  // Get unique categories for filter
  const { data: allResources } = await supabase
    .from('resources')
    .select('category')
    .eq('program_id', program.id);
  
  const categories = Array.from(
    new Set(
      allResources
        ?.map((r) => r.category)
        .filter((c): c is string => Boolean(c)) || []
    )
  ).sort();
  
  return (
    <div className="min-h-screen bg-white">
      <ProgramNav program={program as Program} locale={locale} />
      <ResourcesClient
        resources={resources || []}
        categories={categories}
        locale={locale}
        programSlug={slug}
        selectedCategory={category || 'all'}
      />
    </div>
  );
}
