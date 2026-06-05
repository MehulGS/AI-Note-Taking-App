import type { Context } from 'hono';
import { openPublicShare, unlockShare } from '../services/note.service.js';
import { failure, success } from '../utils/response.js';
import { getClientIp } from '../utils/security.js';

export async function getShareController(c: Context) {
  const token = c.req.param('token');

  if (!token) {
    return failure(c, 'Invalid Share Link', 400);
  }

  const result = await openPublicShare(token);

  if (!result.allowed && result.requiresPassword) {
    return success(c, { requiresPassword: true, accessType: result.accessType, shareType: result.shareType });
  }

  if (!result.allowed) {
    const ownerId = 'ownerId' in result ? result.ownerId : undefined;
    return failure(c, result.message ?? 'Invalid Share Link', 400, ownerId ? { ownerId } : undefined);
  }

  return success(c, result.note);
}

export async function unlockShareController(c: Context) {
  const body = c.get('validatedBody');
  const token = c.req.param('token');

  if (!token) {
    return failure(c, 'Unable to access note.', 400);
  }

  const result = await unlockShare(token, body.password, getClientIp(c));

  if (!result.allowed) {
    return failure(c, result.message ?? 'Unable to access note.', 400);
  }

  return success(c, result.note);
}
