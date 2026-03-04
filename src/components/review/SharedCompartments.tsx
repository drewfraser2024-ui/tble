'use client';

import CompartmentSection from './CompartmentSection';
import { getCompartmentsForCategory } from '@/lib/constants';
import type { BusinessCategory } from '@/types/review';

interface SharedCompartmentsProps {
  ratings: Record<string, Record<string, number>>;
  onRatingChange: (compartment: string, criterion: string, rating: number) => void;
  errors?: Record<string, Record<string, string>>;
  category?: BusinessCategory;
}

export default function SharedCompartments({
  ratings,
  onRatingChange,
  errors,
  category = 'restaurant',
}: SharedCompartmentsProps) {
  const compartments = getCompartmentsForCategory(category);

  return (
    <div className="space-y-4">
      {Object.entries(compartments).map(([key, compartment]) => (
        <CompartmentSection
          key={key}
          title={compartment.label}
          criteria={compartment.criteria}
          ratings={ratings[key] || {}}
          onRatingChange={(criterion, rating) => onRatingChange(key, criterion, rating)}
          errors={errors?.[key]}
        />
      ))}
    </div>
  );
}
