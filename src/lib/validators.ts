import { z } from 'zod';

const ratingSchema = z.number().int().min(1, 'Rating is required').max(5);

const sharedCompartmentsSchema = z.object({
  food: z.object({
    taste: ratingSchema,
    freshness: ratingSchema,
    portion_size: ratingSchema,
    menu_variety: ratingSchema,
  }),
  customer_service: z.object({
    staff_friendliness: ratingSchema,
    menu_knowledge: ratingSchema,
    service_efficiency: ratingSchema,
    attentiveness: ratingSchema,
  }),
  establishment: z.object({
    location_accessibility: ratingSchema,
    bang_for_buck: ratingSchema,
  }),
});

export const restaurantReviewSchema = z.object({
  compartments: sharedCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});

export const businessReviewSchema = z.object({
  compartments: sharedCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});

export const foodtruckReviewSchema = z.object({
  compartments: sharedCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});
