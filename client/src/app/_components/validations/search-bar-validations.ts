import { z } from 'zod';

export const searchBarValidationSchema = z.object({
  query: z.string(),
});
