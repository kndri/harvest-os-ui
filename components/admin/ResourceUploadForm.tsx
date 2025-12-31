'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ResourceUploadFormProps {
  programId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ResourceUploadForm({
  programId,
  onSuccess,
  onCancel,
}: ResourceUploadFormProps) {
  const [titleEn, setTitleEn] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr' | 'both'>('both');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !file) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in');
      }

      // Generate storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storagePath = `${programId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Create resource record
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          program_id: programId,
          title_en: titleEn.trim(),
          title_fr: titleFr.trim() || null,
          description_en: descriptionEn.trim() || null,
          description_fr: descriptionFr.trim() || null,
          category: category.trim() || null,
          language,
          storage_path: storagePath,
          file_type: fileExt || null,
          file_size: file.size,
          created_by: user.id,
        });

      if (insertError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('resources').remove([storagePath]);
        throw insertError;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error uploading resource:', err);
      alert(err.message || 'Error uploading resource');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload Resource</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (English) *
          </label>
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Title (French)
          </label>
          <input
            type="text"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (English)
          </label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (French)
          </label>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Handout, Guide, Video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'both')}
              className="w-full p-2 border rounded"
            >
              <option value="both">Both</option>
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            File *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
          {file && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
