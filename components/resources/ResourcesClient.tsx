'use client';

import { Resource } from '@/lib/types';
import { ResourceCard } from './ResourceCard';
import { ResourceFilter } from './ResourceFilter';

interface ResourcesClientProps {
  resources: Resource[];
  categories: string[];
  locale: 'en' | 'fr';
  programSlug: string;
  selectedCategory: string;
}

export function ResourcesClient({
  resources,
  categories,
  locale,
  programSlug,
  selectedCategory,
}: ResourcesClientProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1c1f24] mb-4">
            {locale === 'fr' ? 'Ressources' : 'Resources'}
          </h1>
          <p className="text-xl text-[#64748b] mb-8">
            {locale === 'fr' 
              ? 'Découvrez les ressources et informations du programme' 
              : 'Discover program resources and information'}
          </p>
          
          {categories.length > 0 && (
            <ResourceFilter categories={categories} locale={locale} />
          )}
        </div>
        
        {resources.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                locale={locale}
                programSlug={programSlug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-[#e2e8f0]">
            <svg className="w-16 h-16 text-[#94a3b8] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[#64748b] font-medium text-lg">
              {locale === 'fr' ? 'Aucune ressource disponible.' : 'No resources available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
