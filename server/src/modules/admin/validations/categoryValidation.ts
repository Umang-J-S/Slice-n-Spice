import { z } from 'zod';

export const addCategorySchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Category name is required',
    }).min(2, 'Category name must be at least 2 characters long'),
    displayOrder: z.number().int().nonnegative().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters long').optional(),
    displayOrder: z.number().int().nonnegative().optional(),
  }),
});
