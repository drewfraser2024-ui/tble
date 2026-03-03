'use client';

import CompartmentSection from './CompartmentSection';
import { BUSINESS_COMPARTMENTS } from '@/lib/constants';

interface BusinessCompartmentsProps {
  ratings: Record<string, Record<string, number>>;
  onRatingChange: (compartment: string, criterion: string, rating: number) => void;
  errors?: Record<string, Record<string, string>>;
}

export default function BusinessCompartments({
  ratings,
  onRatingChange,
  errors,
}: BusinessCompartmentsProps) {
  return (
    <div className="space-y-4">
      {Object.entries(BUSINESS_COMPARTMENTS).map(([key, compartment]) => (
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
