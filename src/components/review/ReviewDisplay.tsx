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
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center">
              <span className="text-turquoise font-bold text-sm">
                {review.user_display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm text-black">{review.user_display_name}</p>
              <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
            </div>
          </div>
        </div>
        <StarRating value={review.overall_rating} size="sm" readOnly />
      </div>

      <p className="text-sm text-gray-700 mb-4">{review.review_text}</p>

      {/* Compartment breakdown */}
      {Object.keys(compartmentRatings).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {Object.entries(compartmentRatings).map(([compartment, criteria]) => {
            const avg = criteria.reduce((sum, c) => sum + c.rating, 0) / criteria.length;
            return (
              <div key={compartment} className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500 capitalize mb-1">
                  {compartment.replace(/_/g, ' ')}
                </p>
                <p className="text-sm font-bold text-black">{avg.toFixed(1)}</p>
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
