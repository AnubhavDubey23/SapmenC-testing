import { z } from 'zod';

export const addsegmentValidationSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters'),
});
