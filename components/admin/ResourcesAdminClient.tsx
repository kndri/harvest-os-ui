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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Resource
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
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
              className="border rounded-lg p-6 bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{resource.title_en}</h3>
                  {resource.title_fr && (
                    <p className="text-sm text-gray-600">{resource.title_fr}</p>
                  )}
                  {resource.category && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
              {resource.description_en && (
                <p className="text-sm text-gray-600 mb-2">{resource.description_en}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {resource.file_type && <span className="uppercase">{resource.file_type}</span>}
                {resource.file_size && <span>{formatFileSize(resource.file_size)}</span>}
                <span>{resource.download_count} downloads</span>
                <span>Language: {resource.language}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-12">No resources yet.</p>
      )}
    </div>
  );
}
