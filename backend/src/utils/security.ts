import type { Context } from 'hono';

export function getClientIp(c: Context) {
  const forwardedFor = c.req.header('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || c.req.header('cf-connecting-ip') || c.req.header('x-real-ip') || 'unknown';
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}
