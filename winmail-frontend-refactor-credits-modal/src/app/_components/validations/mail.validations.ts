import { z } from 'zod';

export const sendMailValidationSchema = z.object({
  message: z.string().nonempty('Message is required'),
});

export const nodemailerConfigValidationSchema = z.object({
  service: z.string(),
  auth: z.object({
    user: z.string(),
    pass: z.string(),
  }),
  display_name: z.string().min(1, 'Display name should be atleast 1 character'),
  host: z.string().optional(),
});
