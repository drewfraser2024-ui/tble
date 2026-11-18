import StarRating from '@/components/ui/StarRating';
import CommentSection from './CommentSection';
import OwnerResponse from './OwnerResponse';
import OwnerResponseForm from './OwnerResponseForm';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types/review';

interface ReviewDisplayProps {
  review: Review;
  isOwner?: boolean;
  isPremium?: boolean;
  businessId?: string;
}

export default function ReviewDisplay({ review, isOwner, isPremium, businessId }: ReviewDisplayProps) {
  // Group ratings by compartment
  const compartmentRatings: Record<string, { criterion: string; rating: number }[]> = {};
  review.ratings?.forEach((r) => {
    if (!compartmentRatings[r.compartment]) {
      compartmentRatings[r.compartment] = [];
    }
    compartmentRatings[r.compartment].push({ criterion: r.criterion, rating: r.rating });
  });

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-turquoise/15 flex items-center justify-center">
              <span className="text-turquoise font-bold text-sm">
                {review.user_display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-sm text-white">{review.user_display_name}</p>
                {review.verification_status === 'verified' && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-turquoise/15 text-turquoise text-[10px] font-bold"
                    title="This reviewer confirmed their visit with a receipt"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1l2.4 1.9 3-.3 1 2.9 2.6 1.5-1 2.9 1 2.9-2.6 1.5-1 2.9-3-.3L10 19l-2.4-1.9-3 .3-1-2.9L1 13.2l1-2.9-1-2.9 2.6-1.5 1-2.9 3 .3L10 1zm-1.2 11.6l4.6-4.6-1.1-1.1-3.5 3.5-1.5-1.5-1.1 1.1 2.6 2.6z" clipRule="evenodd" />
                    </svg>
                    Verified Visit
                  </span>
                )}
              </div>
              <p className="text-xs text-text-dim">{formatDate(review.created_at)}</p>
            </div>
          </div>
        </div>
        <StarRating value={review.overall_rating} size="sm" readOnly />
      </div>

      <p className="text-sm text-text-mid mb-4">{review.review_text}</p>

      {/* Compartment breakdown */}
      {Object.keys(compartmentRatings).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(compartmentRatings).map(([compartment, criteria]) => {
            const avg = criteria.reduce((sum, c) => sum + c.rating, 0) / criteria.length;
            return (
              <div key={compartment} className="bg-white/5 border border-[var(--hairline)] rounded-lg p-2 text-center">
                <p className="text-xs text-text-lo capitalize mb-1">
                  {compartment.replace(/_/g, ' ')}
                </p>
                <p className="text-sm font-bold text-white">{avg.toFixed(1)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt="Review"
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* Owner Response */}
      {review.owner_response && review.owner_response.length > 0 ? (
        <OwnerResponse response={review.owner_response[0]} />
      ) : isOwner && isPremium && businessId ? (
        <OwnerResponseForm reviewId={review.id} businessId={businessId} />
      ) : null}

      {/* Comments */}
      <CommentSection reviewId={review.id} initialComments={review.comments || []} />
    </div>
  );
}
