import { z } from 'zod';

export const shortenSchema = z.object({
  originalUrl: z.string().url({ message: 'Must be a valid URL' }),
  alias: z
    .string()
    .regex(/^[A-Za-z0-9_-]{3,20}$/, {
      message: 'Alias must be 3–20 chars, letters, numbers, _ or -',
    })
    .optional(),
  expiresAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().refine((d) => d > new Date(), { message: 'Дата должна быть в будущем' }),
    )
    .optional(),
});
