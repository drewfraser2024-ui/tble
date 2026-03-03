'use client';

import StarRating from '@/components/ui/StarRating';
import type { CompartmentCriterion } from '@/types/review';

interface CompartmentSectionProps {
  title: string;
  criteria: CompartmentCriterion[];
  ratings: Record<string, number>;
  onRatingChange: (criterionKey: string, rating: number) => void;
  errors?: Record<string, string>;
}

export default function CompartmentSection({
  title,
  criteria,
  ratings,
  onRatingChange,
  errors,
}: CompartmentSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-turquoise" />
        {title}
      </h3>
      <div className="space-y-3">
        {criteria.map((criterion) => (
          <div key={criterion.key} className="flex items-center justify-between">
            <label className="text-sm text-gray-600">{criterion.label}</label>
            <div className="flex items-center gap-2">
              <StarRating
                value={ratings[criterion.key] || 0}
                onChange={(rating) => onRatingChange(criterion.key, rating)}
                size="sm"
              />
              {errors?.[criterion.key] && (
                <span className="text-xs text-pink">Required</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
