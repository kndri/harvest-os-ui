'use client';

import { Resource } from '@/lib/types';
import { getLocalizedText } from '@/lib/i18n';
import { format } from 'date-fns';

interface ResourceCardProps {
  resource: Resource;
  locale: 'en' | 'fr';
  programSlug: string;
}

export function ResourceCard({ resource, locale, programSlug }: ResourceCardProps) {
  const title = getLocalizedText(resource.title_en, resource.title_fr, locale);
  const description = getLocalizedText(resource.description_en, resource.description_fr, locale);

  const handleDownload = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = title;
      link.click();
      URL.revokeObjectURL(url);

      // Increment download count
      await supabase
        .from('resources')
        .update({ download_count: resource.download_count + 1 })
        .eq('id', resource.id);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="card p-6 rounded-lg border bg-white transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {resource.category && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {resource.category}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {resource.file_type && (
            <span className="uppercase">{resource.file_type}</span>
          )}
          {resource.file_size && (
            <span>{formatFileSize(resource.file_size)}</span>
          )}
          <span>{resource.download_count} {locale === 'fr' ? 'téléchargements' : 'downloads'}</span>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {locale === 'fr' ? 'Télécharger' : 'Download'}
        </button>
      </div>
    </div>
  );
}
