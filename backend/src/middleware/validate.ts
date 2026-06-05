import type { Context, Next } from 'hono';
import type { ZodSchema } from 'zod';
import { failure } from '../utils/response.js';

export function validateBody(schema: ZodSchema) {
  return async (c: Context, next: Next) => {
    const body = await c.req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid request payload';
      return failure(c, message, 422);
    }

    c.set('validatedBody', parsed.data);
    await next();
  };
}
