import { nanoid } from 'nanoid';
import { Note, type NoteDocument } from '../models/note.model.js';
import { generateAccessPassword, hashSecret, verifySecret } from '../utils/password.js';
import { clearAttempts, getAttemptKey, isLocked, recordFailedAttempt } from './lockout.service.js';
import type { AccessType, ShareStatus, ShareType } from '../types/app.js';

function toSafeNote(note: NoteDocument) {
  return {
    id: note._id.toString(),
    title: note.title,
    content: note.content,
    shareType: note.shareType,
    accessType: note.accessType,
    expiresAt: note.expiresAt,
    shareToken: note.shareToken,
    viewCount: note.viewCount,
    isRevoked: note.isRevoked,
    isUsed: note.isUsed,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

export function getStatus(note: NoteDocument): ShareStatus {
  if (note.isRevoked) return 'Revoked';
  if (note.expiresAt.getTime() <= Date.now()) return 'Expired';
  if (note.shareType === 'ONE_TIME' && note.isUsed) return 'Used';
  return 'Active';
}

export async function createNote(input: { userId: string; title: string; content: string; shareType: ShareType; accessType: AccessType; expiresAt: Date }, clientUrl: string) {
  const shareToken = nanoid(32);
  const plainPassword = input.accessType === 'PASSWORD_PROTECTED' ? generateAccessPassword() : null;

  const note = await Note.create({
    userId: input.userId,
    title: input.title,
    content: input.content,
    shareType: input.shareType,
    accessType: input.accessType,
    expiresAt: input.expiresAt,
    shareToken,
    accessKey: plainPassword ? await hashSecret(plainPassword) : null,
  });

  return {
    note: { ...toSafeNote(note), status: getStatus(note) },
    shareUrl: `${clientUrl}/share/${shareToken}`,
    password: plainPassword,
  };
}

export async function getUserNote(noteId: string, userId: string, clientUrl: string) {
  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw new Error('Note not found');
  }

  return {
    ...toSafeNote(note),
    status: getStatus(note),
    shareUrl: `${clientUrl}/share/${note.shareToken}`,
  };
}

export async function getMyNotes(userId: string, clientUrl: string, scope: 'active' | 'history' = 'active') {
  const notes = await Note.find({ userId }).sort({ createdAt: -1 });

  return notes
    .map((note) => ({
      ...toSafeNote(note),
      status: getStatus(note),
      shareUrl: `${clientUrl}/share/${note.shareToken}`,
    }))
    .filter((note) => scope === 'active' ? note.status === 'Active' : note.status !== 'Active')
    .sort((a, b) => {
      if (scope === 'history') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      const createdDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return createdDiff || b.viewCount - a.viewCount;
    });
}

export async function revokeNote(noteId: string, userId: string) {
  const note = await Note.findOneAndUpdate({ _id: noteId, userId }, { $set: { isRevoked: true } }, { new: true });

  if (!note) {
    throw new Error('Note not found');
  }

  return { id: note._id.toString(), isRevoked: note.isRevoked, status: getStatus(note) };
}

function shareFailure(note: NoteDocument | null) {
  if (!note) return 'Invalid Share Link';
  if (note.isRevoked) return 'This link has been revoked.';
  if (note.expiresAt.getTime() <= Date.now()) return 'This share link has expired.';
  if (note.shareType === 'ONE_TIME' && note.isUsed) return 'This share link has already been used.';
  return null;
}

export async function openPublicShare(token: string) {
  const note = await Note.findOne({ shareToken: token });
  const failed = shareFailure(note);

  if (failed) {
    return { allowed: false, message: failed, ownerId: note?._id ? note.userId.toString() : undefined };
  }

  if (note!.accessType === 'PASSWORD_PROTECTED') {
    return { allowed: false, requiresPassword: true, accessType: note!.accessType, shareType: note!.shareType };
  }

  const query = {
    shareToken: token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
    ...(note!.shareType === 'ONE_TIME' ? { isUsed: false } : {}),
  };

  const update = {
    ...(note!.shareType === 'ONE_TIME' ? { $set: { isUsed: true } } : {}),
    $inc: { viewCount: 1 },
  };

  const opened = await Note.findOneAndUpdate(query, update, { new: true });

  if (!opened) {
    return { allowed: false, message: 'Unable to access note.' };
  }

  return { allowed: true, note: { ...toSafeNote(opened), status: getStatus(opened) } };
}

export async function unlockShare(token: string, password: string, ip: string) {
  const attemptKey = getAttemptKey(token, ip);

  if (isLocked(attemptKey)) {
    return { allowed: false, message: 'Unable to access note.' };
  }

  const note = await Note.findOne({ shareToken: token });
  const failed = shareFailure(note);

  if (failed || !note || note.accessType !== 'PASSWORD_PROTECTED' || !note.accessKey) {
    recordFailedAttempt(attemptKey);
    return { allowed: false, message: 'Unable to access note.' };
  }

  const passwordMatches = await verifySecret(password, note.accessKey);

  if (!passwordMatches) {
    recordFailedAttempt(attemptKey);
    return { allowed: false, message: 'Unable to access note.' };
  }

  const query = {
    shareToken: token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
    ...(note.shareType === 'ONE_TIME' ? { isUsed: false } : {}),
  };

  const update = {
    ...(note.shareType === 'ONE_TIME' ? { $set: { isUsed: true } } : {}),
    $inc: { viewCount: 1 },
  };

  const opened = await Note.findOneAndUpdate(query, update, { new: true });

  if (!opened) {
    return { allowed: false, message: 'Unable to access note.' };
  }

  clearAttempts(attemptKey);
  return { allowed: true, note: { ...toSafeNote(opened), status: getStatus(opened) } };
}
