import { z } from 'zod';

export const addUserValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Email is required'),
});
