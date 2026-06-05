import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt.js';
import { failure } from '../utils/response.js';

export async function authMiddleware(c: Context, next: Next) {
  const header = c.req.header('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return failure(c, 'Unauthorized', 401);
  }

  try {
    c.set('user', verifyToken(token));
    await next();
  } catch {
    return failure(c, 'Unauthorized', 401);
  }
}
