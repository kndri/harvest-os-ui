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
  
  // Check if storage_path is a URL (external link) or a file path (downloadable)
  const isExternalLink = resource.storage_path && (
    resource.storage_path.startsWith('http://') || 
    resource.storage_path.startsWith('https://')
  );
  const isDownloadable = resource.storage_path && resource.storage_path.trim() !== '' && !isExternalLink;
  const hasAction = isDownloadable || isExternalLink;

  const handleDownload = async () => {
    if (!isDownloadable) return;
    
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.storage_path!);

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

  const handleViewLink = () => {
    if (isExternalLink && resource.storage_path) {
      window.open(resource.storage_path, '_blank', 'noopener,noreferrer');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatFileType = (fileType: string | null) => {
    if (!fileType) return '';
    // Format file type display (e.g., "application/pdf" -> "PDF")
    if (fileType.includes('/')) {
      return fileType.split('/')[1].toUpperCase();
    }
    return fileType.toUpperCase();
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 transition-all hover:shadow-md hover:border-[#cbd5e1]">
      {/* Title */}
      <h3 className="text-xl font-semibold text-[#1c1f24] mb-3">{title}</h3>
      
      {/* Category Tag */}
      {resource.category && (
        <div className="mb-4">
          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {resource.category}
          </span>
        </div>
      )}
      
      {/* Description */}
      {description && (
        <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Metadata and Action */}
      <div className="pt-4 border-t border-[#e2e8f0]">
        <div className="flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-[#64748b]">
            {resource.file_type && (
              <span className="font-medium uppercase tracking-wide">
                {formatFileType(resource.file_type)}
              </span>
            )}
            {resource.file_size && (
              <span className="font-medium">{formatFileSize(resource.file_size)}</span>
            )}
            {isDownloadable && (
              <span className="font-medium">
                {resource.download_count} {locale === 'fr' ? 'téléchargements' : 'downloads'}
              </span>
            )}
            {isExternalLink && (
              <span className="font-medium">
                {resource.download_count} {locale === 'fr' ? 'vues' : 'views'}
              </span>
            )}
          </div>
          
          {/* Action Button */}
          {isDownloadable && (
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all text-sm font-medium shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {locale === 'fr' ? 'Télécharger' : 'Download'}
            </button>
          )}
          
          {isExternalLink && (
            <button
              onClick={handleViewLink}
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all text-sm font-medium shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {locale === 'fr' ? 'Voir le lien' : 'View Link'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
