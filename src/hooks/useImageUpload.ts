'use client';

import { createClient } from '@/lib/supabase/client';

interface UploadResult {
  storagePath: string;
  publicUrl: string;
}

export function useImageUpload() {
  const supabase = createClient();

  async function uploadImage(file: File, reviewId: string): Promise<UploadResult> {
    const ext = file.name.split('.').pop();
    const path = `reviews/${reviewId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('review-images')
      .getPublicUrl(data.path);

    return { storagePath: data.path, publicUrl: urlData.publicUrl };
  }

  async function uploadMultiple(
    files: { file: File; type: string }[],
    reviewId: string
  ): Promise<(UploadResult & { type: string })[]> {
    const results = await Promise.all(
      files.map(async (f) => {
        const result = await uploadImage(f.file, reviewId);
        return { ...result, type: f.type };
      })
    );
    return results;
  }

  return { uploadImage, uploadMultiple };
}
