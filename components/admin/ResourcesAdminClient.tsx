'use client';

import { useState } from 'react';
import { Resource } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { ResourceUploadForm } from './ResourceUploadForm';

interface ResourcesAdminClientProps {
  resources: Resource[];
  programId: string;
}

export function ResourcesAdminClient({
  resources: initialResources,
  programId,
}: ResourcesAdminClientProps) {
  const [resources, setResources] = useState(initialResources);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const supabase = createClient();
      const resource = resources.find((r) => r.id === resourceId);
      
      if (resource) {
        // Delete from storage
        await supabase.storage
          .from('resources')
          .remove([resource.storage_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setResources((prev) => prev.filter((r) => r.id !== resourceId));
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Error deleting resource');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    window.location.reload();
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Resources</h1>
          <p className="text-[#64748b]">Manage program resources and files</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + Upload Resource
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
          <ResourceUploadForm
            programId={programId}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {resources.length > 0 ? (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="border border-[#e2e8f0] rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1c1f24]">{resource.title_en}</h3>
                  {resource.title_fr && (
                    <p className="text-sm text-[#64748b] mt-1">{resource.title_fr}</p>
                  )}
                  {resource.category && (
                    <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                      {resource.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                >
                  Delete
                </button>
              </div>
              {resource.description_en && (
                <p className="text-sm text-[#64748b] mb-3">{resource.description_en}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                {resource.file_type && <span className="uppercase font-medium">{resource.file_type}</span>}
                {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
                <span>{resource.download_count} downloads</span>
                <span>Language: {resource.language}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-[#64748b] font-medium">No resources yet.</p>
        </div>
      )}
    </div>
  );
}
