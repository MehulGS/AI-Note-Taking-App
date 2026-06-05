import type { Context } from 'hono';
import { env } from '../config/env.js';
import { createNote, getMyNotes, getUserNote, revokeNote } from '../services/note.service.js';
import { failure, success } from '../utils/response.js';

export async function createNoteController(c: Context) {
  try {
    const user = c.get('user');
    const body = c.get('validatedBody');
    return success(c, await createNote({ ...body, userId: user.userId }, env.CLIENT_URL), 201);
  } catch {
    return failure(c, 'Unable to create note', 500);
  }
}

export async function getNoteController(c: Context) {
  try {
    const user = c.get('user');
    const noteId = c.req.param('id');

    if (!noteId) {
      return failure(c, 'Note not found', 404);
    }

    return success(c, await getUserNote(noteId, user.userId, env.CLIENT_URL));
  } catch {
    return failure(c, 'Note not found', 404);
  }
}

export async function getMyNotesController(c: Context) {
  const user = c.get('user');
  const scope = c.req.query('scope') === 'history' ? 'history' : 'active';
  return success(c, await getMyNotes(user.userId, env.CLIENT_URL, scope));
}

export async function revokeNoteController(c: Context) {
  try {
    const user = c.get('user');
    const noteId = c.req.param('id');

    if (!noteId) {
      return failure(c, 'Note not found', 404);
    }

    return success(c, await revokeNote(noteId, user.userId));
  } catch {
    return failure(c, 'Note not found', 404);
  }
}
