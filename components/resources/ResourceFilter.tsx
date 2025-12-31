'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface ResourceFilterProps {
  categories: string[];
  locale: 'en' | 'fr';
}

export function ResourceFilter({ categories, locale }: ResourceFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get('category') || 'all';

  const updateFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => updateFilter('all')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
            : 'bg-[#f2f4f6] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1c1f24] border border-[#e2e8f0]'
        }`}
      >
        {locale === 'fr' ? 'Tous' : 'All'}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => updateFilter(category)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === category
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-[#f2f4f6] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1c1f24] border border-[#e2e8f0]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
