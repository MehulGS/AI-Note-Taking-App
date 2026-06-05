import { Hono } from 'hono';
import { getShareController, unlockShareController } from '../controllers/share.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';
import { unlockNoteSchema } from '../validators/note.validator.js';

export const shareRoutes = new Hono();

shareRoutes.get('/:token', rateLimit({ windowMs: 60 * 1000, max: 60, keyPrefix: 'share-open' }), getShareController);
shareRoutes.post('/:token/unlock', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: 'share-unlock' }), validateBody(unlockNoteSchema), unlockShareController);
