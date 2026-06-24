import { z } from 'zod';

export const createChefSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
    role: z.string({ message: 'Role is required' }),
    bio: z.string({ message: 'Bio is required' }),
    photoUrl: z.string({ message: 'Photo URL is required' }).url('Photo URL must be a valid URL'),
    specialties: z.array(z.string()).optional().default([]),
    experienceYears: z.number().int().nonnegative().optional(),
  }),
});

export const updateChefSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    photoUrl: z.string().url('Photo URL must be a valid URL').optional(),
    specialties: z.array(z.string()).optional(),
    experienceYears: z.number().int().nonnegative().optional(),
  }),
});
