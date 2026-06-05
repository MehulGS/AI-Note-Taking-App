import type { Context } from 'hono';

type SuccessStatus = 200 | 201;
type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500;

export function success<T>(c: Context, data: T, status: SuccessStatus = 200) {
  return c.json({ success: true, data }, status);
}

export function failure<T>(c: Context, message = 'Request failed', status: ErrorStatus = 400, data?: T) {
  return c.json({ success: false, message, ...(data ? { data } : {}) }, status);
}

export function genericFailure(c: Context, status: ErrorStatus = 400) {
  return failure(c, 'Request failed', status);
}
