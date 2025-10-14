import { z } from 'zod';

export const createContactValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});
