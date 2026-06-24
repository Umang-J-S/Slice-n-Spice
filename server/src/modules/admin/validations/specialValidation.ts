import { z } from 'zod';

export const addSpecialSchema = z.object({
  body: z.object({
    item: z.string({
      message: 'Item ID is required',
    }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid item ID format'),
    date: z.string().datetime({ message: 'Invalid date format' }).optional(), // Optional, defaults to now in schema
  }),
});
