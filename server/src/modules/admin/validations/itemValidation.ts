import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }).min(2, 'Title must be at least 2 characters long'),
    description: z.string().optional(),
    price: z.number({
      message: 'Price is required and must be a number',
    }).positive('Price must be greater than 0'),
    photoUrl: z.string().url('Photo URL must be a valid URL').optional().or(z.literal('')),
    category: z.string({
      message: 'Category ID is required',
    }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
    dietaryAttributes: z.object({
      isVegetarian: z.boolean().default(false),
      isVegan: z.boolean().default(false),
    }).optional(),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters long').optional(),
    description: z.string().optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    photoUrl: z.string().url('Photo URL must be a valid URL').optional().or(z.literal('')),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format').optional(),
    dietaryAttributes: z.object({
      isVegetarian: z.boolean().default(false),
      isVegan: z.boolean().default(false),
    }).optional(),
  }),
});
