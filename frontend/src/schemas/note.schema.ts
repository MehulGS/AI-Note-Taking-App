import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  shareType: z.enum(['ONE_TIME', 'TIME_BASED']),
  accessType: z.enum(['PUBLIC', 'PASSWORD_PROTECTED']),
  expiresAt: z.string().min(1, 'Expiry is required').refine((value) => new Date(value).getTime() > Date.now(), 'Expiry must be in the future'),
});

export const unlockSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UnlockInput = z.infer<typeof unlockSchema>;
