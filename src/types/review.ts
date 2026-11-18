export type BusinessCategory = 'restaurant' | 'business' | 'foodtruck';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  cover_image_url: string | null;
  avg_overall_rating: number;
  review_count: number;
  is_premium: boolean;
  owner_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  user_display_name: string;
  overall_rating: number;
  review_text: string;
  verification_status: VerificationStatus;
  receipt_url: string | null;
  receipt_total: number | null;
  receipt_dated_on: string | null;
  verification_confidence: number | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  ratings?: ReviewRating[];
  images?: ReviewImage[];
  comments?: Comment[];
  owner_response?: OwnerResponse[];
}

export interface ReceiptScanResult {
  status: VerificationStatus;
  confidence: number; // 0-100
  detectedTotal: number | null;
  detectedDate: string | null; // ISO yyyy-mm-dd
  matchedBusinessName: boolean;
  checks: { label: string; passed: boolean }[];
}

export interface ReviewRating {
  id: string;
  review_id: string;
  compartment: string;
  criterion: string;
  rating: number;
}

export interface ReviewImage {
  id: string;
  review_id: string;
  storage_path: string;
  image_url: string;
  image_type: string;
  display_order: number;
  created_at: string;
}

export interface Comment {
  id: string;
  review_id: string;
  user_id: string;
  user_display_name: string;
  comment_text: string;
  created_at: string;
}

export interface OwnerResponse {
  id: string;
  review_id: string;
  business_id: string;
  user_id: string;
  user_display_name: string;
  response_text: string;
  image_url: string | null;
  storage_path: string | null;
  created_at: string;
}

export interface CompartmentCriterion {
  key: string;
  label: string;
}

export interface Compartment {
  label: string;
  criteria: CompartmentCriterion[];
}

export interface ReviewFormState {
  compartments: Record<string, Record<string, number>>;
  reviewText: string;
  images: {
    file: File;
    preview: string;
    type: 'food' | 'establishment' | 'general';
  }[];
  isSubmitting: boolean;
  errors: Record<string, string>;
}
