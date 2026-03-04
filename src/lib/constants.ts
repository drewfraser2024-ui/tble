import type { Compartment } from '@/types/review';

export const SHARED_COMPARTMENTS: Record<string, Compartment> = {
  food: {
    label: 'Food',
    criteria: [
      { key: 'taste', label: 'Taste' },
      { key: 'freshness', label: 'Freshness' },
      { key: 'portion_size', label: 'Portion Size' },
      { key: 'menu_variety', label: 'Menu Variety' },
    ],
  },
  customer_service: {
    label: 'Customer Service',
    criteria: [
      { key: 'staff_friendliness', label: 'Staff Friendliness' },
      { key: 'menu_knowledge', label: 'Menu Knowledge' },
      { key: 'service_efficiency', label: 'Service Efficiency' },
      { key: 'attentiveness', label: 'Attentiveness' },
    ],
  },
  establishment: {
    label: 'Establishment',
    criteria: [
      { key: 'location_accessibility', label: 'Location/Accessibility' },
      { key: 'bang_for_buck', label: 'Bang for your Buck' },
    ],
  },
};

// Backward-compatible aliases
export const RESTAURANT_COMPARTMENTS = SHARED_COMPARTMENTS;
export const BUSINESS_COMPARTMENTS = SHARED_COMPARTMENTS;
export const FOODTRUCK_COMPARTMENTS = SHARED_COMPARTMENTS;

export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const MIN_REVIEW_LENGTH = 20;
