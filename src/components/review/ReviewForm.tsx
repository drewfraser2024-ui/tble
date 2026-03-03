'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/ui/StarRating';
import ImageUploader from '@/components/ui/ImageUploader';
import VoiceToTextButton from '@/components/ui/VoiceToTextButton';
import RestaurantCompartments from './RestaurantCompartments';
import BusinessCompartments from './BusinessCompartments';
import { createClient } from '@/lib/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';
import { MIN_REVIEW_LENGTH } from '@/lib/constants';
import type { BusinessCategory, ReviewFormState } from '@/types/review';

interface ReviewFormProps {
  businessId: string;
  businessName: string;
  category: BusinessCategory;
}

export default function ReviewForm({ businessId, businessName, category }: ReviewFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const { uploadMultiple } = useImageUpload();

  const [form, setForm] = useState<ReviewFormState>({
    overallRating: 0,
    compartments: {},
    reviewText: '',
    images: [],
    isSubmitting: false,
    errors: {},
  });

  const handleCompartmentRating = useCallback(
    (compartment: string, criterion: string, rating: number) => {
      setForm((prev) => ({
        ...prev,
        compartments: {
          ...prev.compartments,
          [compartment]: {
            ...prev.compartments[compartment],
            [criterion]: rating,
          },
        },
        errors: { ...prev.errors, compartments: '' },
      }));
    },
    []
  );

  const handleVoiceTranscript = useCallback((text: string) => {
    setForm((prev) => ({
      ...prev,
      reviewText: prev.reviewText + (prev.reviewText ? ' ' : '') + text,
    }));
  }, []);

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (form.overallRating === 0) {
      errors.overallRating = 'Please provide an overall rating';
    }
    if (form.reviewText.length < MIN_REVIEW_LENGTH) {
      errors.reviewText = `Review must be at least ${MIN_REVIEW_LENGTH} characters`;
    }

    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setForm((prev) => ({ ...prev, isSubmitting: true, errors: {} }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setForm((prev) => ({ ...prev, isSubmitting: false, errors: { auth: 'Please sign in to leave a review' } }));
        return;
      }

      // Insert review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          business_id: businessId,
          user_id: user.id,
          user_display_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          overall_rating: form.overallRating,
          review_text: form.reviewText,
        })
        .select('id')
        .single();

      if (reviewError) throw reviewError;

      // Insert ratings
      const ratingRows = Object.entries(form.compartments).flatMap(([compartment, criteria]) =>
        Object.entries(criteria).map(([criterion, rating]) => ({
          review_id: review.id,
          compartment,
          criterion,
          rating,
        }))
      );

      if (ratingRows.length > 0) {
        const { error: ratingsError } = await supabase
          .from('review_ratings')
          .insert(ratingRows);
        if (ratingsError) throw ratingsError;
      }

      // Upload images
      if (form.images.length > 0) {
        const uploaded = await uploadMultiple(
          form.images.map((img) => ({ file: img.file, type: img.type })),
          review.id
        );

        const imageRows = uploaded.map((img, i) => ({
          review_id: review.id,
          storage_path: img.storagePath,
          image_url: img.publicUrl,
          image_type: img.type,
          display_order: i,
        }));

        const { error: imagesError } = await supabase
          .from('review_images')
          .insert(imageRows);
        if (imagesError) throw imagesError;
      }

      router.push(`/${category}/${businessId}`);
      router.refresh();
    } catch (err) {
      console.error('Review submission failed:', err);
      setForm((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { submit: 'Failed to submit review. Please try again.' },
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black">Review {businessName}</h2>
        <p className="text-gray-500 text-sm mt-1">Rate your experience across all categories</p>
      </div>

      {/* Compartment Ratings */}
      {category === 'restaurant' ? (
        <RestaurantCompartments
          ratings={form.compartments}
          onRatingChange={handleCompartmentRating}
        />
      ) : (
        <BusinessCompartments
          ratings={form.compartments}
          onRatingChange={handleCompartmentRating}
        />
      )}

      {/* Overall Rating */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gold" />
          Overall Rating
        </h3>
        <div className="flex items-center gap-3">
          <StarRating
            value={form.overallRating}
            onChange={(rating) =>
              setForm((prev) => ({ ...prev, overallRating: rating, errors: { ...prev.errors, overallRating: '' } }))
            }
            size="lg"
          />
          {form.overallRating > 0 && (
            <span className="text-sm text-gray-500">{form.overallRating}/5</span>
          )}
        </div>
        {form.errors.overallRating && (
          <p className="text-pink text-sm mt-2">{form.errors.overallRating}</p>
        )}
      </div>

      {/* Written Review */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-black flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-pink" />
            Written Review
            <span className="text-xs font-normal text-pink ml-1">Required</span>
          </h3>
          <VoiceToTextButton onTranscript={handleVoiceTranscript} />
        </div>
        <textarea
          value={form.reviewText}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              reviewText: e.target.value,
              errors: { ...prev.errors, reviewText: '' },
            }))
          }
          placeholder="Tell us about your experience in detail..."
          rows={5}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light resize-y"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            {form.reviewText.length}/{MIN_REVIEW_LENGTH} min characters
          </p>
          {form.errors.reviewText && (
            <p className="text-pink text-xs">{form.errors.reviewText}</p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-turquoise" />
          Photos
          <span className="text-xs font-normal text-gray-400 ml-1">Optional</span>
        </h3>
        <ImageUploader
          images={form.images}
          onChange={(images) => setForm((prev) => ({ ...prev, images }))}
          category={category}
        />
      </div>

      {/* Errors */}
      {form.errors.auth && (
        <p className="text-pink text-sm text-center">{form.errors.auth}</p>
      )}
      {form.errors.submit && (
        <p className="text-pink text-sm text-center">{form.errors.submit}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full py-3 px-6 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {form.isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
