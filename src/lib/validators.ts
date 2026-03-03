import { z } from 'zod';

const ratingSchema = z.number().int().min(1, 'Rating is required').max(5);

const restaurantCompartmentsSchema = z.object({
  food: z.object({
    taste: ratingSchema,
    presentation: ratingSchema,
    portion_size: ratingSchema,
    flavor_profile: ratingSchema,
  }),
  customer_service: z.object({
    staff_attitude: ratingSchema,
    efficiency: ratingSchema,
    knowledge_of_menu: ratingSchema,
    responsiveness: ratingSchema,
  }),
  establishment: z.object({
    cleanliness: ratingSchema,
    ambiance: ratingSchema,
    location: ratingSchema,
    accessibility: ratingSchema,
  }),
});

const businessCompartmentsSchema = z.object({
  customer_service: z.object({
    staff_helpfulness: ratingSchema,
    wait_times: ratingSchema,
    product_knowledge: ratingSchema,
    problem_resolution: ratingSchema,
  }),
  shopping_experience: z.object({
    product_availability: ratingSchema,
    store_layout: ratingSchema,
    pricing_transparency: ratingSchema,
    checkout_process: ratingSchema,
  }),
  establishment: z.object({
    store_cleanliness: ratingSchema,
    safety_standards: ratingSchema,
    accessibility: ratingSchema,
    overall_atmosphere: ratingSchema,
  }),
});

export const restaurantReviewSchema = z.object({
  overallRating: ratingSchema,
  compartments: restaurantCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});

export const businessReviewSchema = z.object({
  overallRating: ratingSchema,
  compartments: businessCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});
