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

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  user_display_name: string;
  overall_rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
  ratings?: ReviewRating[];
  images?: ReviewImage[];
  comments?: Comment[];
  owner_response?: OwnerResponse[];
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
