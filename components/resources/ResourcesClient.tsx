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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'fr' ? 'Ressources' : 'Resources'}
      </h1>
      
      {categories.length > 0 && (
        <ResourceFilter categories={categories} locale={locale} />
      )}
      
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
        <p className="text-gray-600 text-center py-12">
          {locale === 'fr' ? 'Aucune ressource disponible.' : 'No resources available.'}
        </p>
      )}
    </div>
  );
}
