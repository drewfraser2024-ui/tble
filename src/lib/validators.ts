import { z } from 'zod';

const ratingSchema = z.number().int().min(1, 'Rating is required').max(5);

const foodSchema = z.object({
  taste: ratingSchema,
  freshness: ratingSchema,
  portion_size: ratingSchema,
  menu_variety: ratingSchema,
});

const customerServiceSchema = z.object({
  staff_friendliness: ratingSchema,
  menu_knowledge: ratingSchema,
  service_efficiency: ratingSchema,
  attentiveness: ratingSchema,
});

const establishmentSchema = z.object({
  location_accessibility: ratingSchema,
  bang_for_buck: ratingSchema,
});

const sharedCompartmentsSchema = z.object({
  food: foodSchema,
  customer_service: customerServiceSchema,
  establishment: establishmentSchema,
});

// Business/Store: no Food ratings
const businessCompartmentsSchema = z.object({
  customer_service: customerServiceSchema,
  establishment: establishmentSchema,
});

export const restaurantReviewSchema = z.object({
  compartments: sharedCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});

export const businessReviewSchema = z.object({
  compartments: businessCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});

export const foodtruckReviewSchema = z.object({
  compartments: sharedCompartmentsSchema,
  reviewText: z.string().min(20, 'Review must be at least 20 characters'),
});
