import type { Context, Next } from 'hono';

export async function requestLogger(c: Context, next: Next) {
  const startedAt = Date.now();
  await next();
  const duration = Date.now() - startedAt;
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${duration}ms`);
}
