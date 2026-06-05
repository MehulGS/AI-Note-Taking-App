import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(160, 'Title is too long'),
  content: z.string().trim().min(1, 'Content is required').max(20000, 'Content is too long'),
  shareType: z.enum(['ONE_TIME', 'TIME_BASED'], { required_error: 'Share type is required' }),
  accessType: z.enum(['PUBLIC', 'PASSWORD_PROTECTED'], { required_error: 'Access type is required' }),
  expiresAt: z.coerce.date().refine((date) => date.getTime() > Date.now(), 'Expiry date must be greater than current time.'),
});

export const unlockNoteSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});
