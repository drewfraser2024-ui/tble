'use client';

import CompartmentSection from './CompartmentSection';
import { RESTAURANT_COMPARTMENTS } from '@/lib/constants';

interface RestaurantCompartmentsProps {
  ratings: Record<string, Record<string, number>>;
  onRatingChange: (compartment: string, criterion: string, rating: number) => void;
  errors?: Record<string, Record<string, string>>;
}

export default function RestaurantCompartments({
  ratings,
  onRatingChange,
  errors,
}: RestaurantCompartmentsProps) {
  return (
    <div className="space-y-4">
      {Object.entries(RESTAURANT_COMPARTMENTS).map(([key, compartment]) => (
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
