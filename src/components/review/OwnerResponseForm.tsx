'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface OwnerResponseFormProps {
  reviewId: string;
  businessId: string;
}

export default function OwnerResponseForm({ reviewId, businessId }: OwnerResponseFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    setError('');

    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let image_url: string | null = null;
      let storage_path: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `owner-responses/${reviewId}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('review-images')
          .getPublicUrl(uploadData.path);

        image_url = urlData.publicUrl;
        storage_path = uploadData.path;
      }

      const { error: insertError } = await supabase
        .from('owner_responses')
        .insert({
          review_id: reviewId,
          business_id: businessId,
          user_id: user.id,
          user_display_name: user.user_metadata?.full_name || user.email || 'Owner',
          response_text: text.trim(),
          image_url,
          storage_path,
        });

      if (insertError) throw insertError;

      // Refresh to show the response
      window.location.reload();
    } catch (err) {
      console.error('Owner response failed:', err);
      setError('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!showForm) {
    return (
      <div className="mt-3">
        <button
          onClick={() => setShowForm(true)}
          className="text-xs text-turquoise-dark hover:text-turquoise font-medium transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Respond as Owner
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-turquoise/5 border border-turquoise/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-turquoise-dark">Owner Response</span>
        <button
          onClick={() => setShowForm(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your response to this review..."
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-turquoise focus:ring-1 focus:ring-turquoise-light resize-y"
        />

        {/* Image upload */}
        {imagePreview ? (
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Response image"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1 -right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs text-gray-400 hover:text-turquoise-dark flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add photo
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {error && <p className="text-pink text-xs">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="text-xs px-4 py-2 bg-turquoise text-white rounded-lg hover:bg-turquoise-dark disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Post Response'}
        </button>
      </form>
    </div>
  );
}
