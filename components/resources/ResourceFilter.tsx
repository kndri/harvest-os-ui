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
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => updateFilter('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {locale === 'fr' ? 'Tous' : 'All'}
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => updateFilter(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
