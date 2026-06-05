import { Hono } from 'hono';
import { createNoteController, getMyNotesController, getNoteController, revokeNoteController } from '../controllers/note.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';
import { createNoteSchema } from '../validators/note.validator.js';

export const noteRoutes = new Hono();

noteRoutes.use('*', authMiddleware);
noteRoutes.post('/', rateLimit({ windowMs: 60 * 1000, max: 30, keyPrefix: 'create-note' }), validateBody(createNoteSchema), createNoteController);
noteRoutes.get('/my-notes', getMyNotesController);
noteRoutes.get('/:id', getNoteController);
noteRoutes.delete('/:id/revoke', revokeNoteController);
