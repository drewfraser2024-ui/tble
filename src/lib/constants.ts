import type { Compartment } from '@/types/review';

export const RESTAURANT_COMPARTMENTS: Record<string, Compartment> = {
  food: {
    label: 'Food',
    criteria: [
      { key: 'taste', label: 'Taste' },
      { key: 'presentation', label: 'Presentation' },
      { key: 'portion_size', label: 'Portion Size' },
      { key: 'flavor_profile', label: 'Flavor Profile' },
    ],
  },
  customer_service: {
    label: 'Customer Service',
    criteria: [
      { key: 'staff_attitude', label: 'Staff Attitude' },
      { key: 'efficiency', label: 'Efficiency' },
      { key: 'knowledge_of_menu', label: 'Knowledge of Menu' },
      { key: 'responsiveness', label: 'Responsiveness' },
    ],
  },
  establishment: {
    label: 'Establishment',
    criteria: [
      { key: 'cleanliness', label: 'Cleanliness' },
      { key: 'ambiance', label: 'Ambiance' },
      { key: 'location', label: 'Location' },
      { key: 'accessibility', label: 'Accessibility' },
    ],
  },
};

export const BUSINESS_COMPARTMENTS: Record<string, Compartment> = {
  customer_service: {
    label: 'Customer Service',
    criteria: [
      { key: 'staff_helpfulness', label: 'Staff Helpfulness' },
      { key: 'wait_times', label: 'Wait Times' },
      { key: 'product_knowledge', label: 'Product Knowledge' },
      { key: 'problem_resolution', label: 'Problem Resolution' },
    ],
  },
  shopping_experience: {
    label: 'Shopping Experience',
    criteria: [
      { key: 'product_availability', label: 'Product Availability' },
      { key: 'store_layout', label: 'Store Layout' },
      { key: 'pricing_transparency', label: 'Pricing Transparency' },
      { key: 'checkout_process', label: 'Checkout Process' },
    ],
  },
  establishment: {
    label: 'Establishment',
    criteria: [
      { key: 'store_cleanliness', label: 'Store Cleanliness' },
      { key: 'safety_standards', label: 'Safety Standards' },
      { key: 'accessibility', label: 'Accessibility' },
      { key: 'overall_atmosphere', label: 'Overall Atmosphere' },
    ],
  },
};

export const FOODTRUCK_COMPARTMENTS: Record<string, Compartment> = {
  food: {
    label: 'Food',
    criteria: [
      { key: 'taste', label: 'Taste' },
      { key: 'freshness', label: 'Freshness' },
      { key: 'portion_size', label: 'Portion Size' },
      { key: 'menu_variety', label: 'Menu Variety' },
    ],
  },
  service: {
    label: 'Service',
    criteria: [
      { key: 'speed', label: 'Speed' },
      { key: 'friendliness', label: 'Friendliness' },
      { key: 'order_accuracy', label: 'Order Accuracy' },
      { key: 'communication', label: 'Communication' },
    ],
  },
  setup: {
    label: 'Setup & Location',
    criteria: [
      { key: 'cleanliness', label: 'Cleanliness' },
      { key: 'accessibility', label: 'Accessibility' },
      { key: 'wait_area', label: 'Wait Area' },
      { key: 'overall_vibe', label: 'Overall Vibe' },
    ],
  },
};

export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const MIN_REVIEW_LENGTH = 20;
