import type { CreateNoteInput, UnlockInput } from '@/schemas/note.schema';
import type { ApiResponse, Note } from '@/types';
import { api } from './api';

export async function createNoteRequest(input: CreateNoteInput) {
  const { data } = await api.post<ApiResponse<{ note: Note; shareUrl: string; password: string | null }>>('/notes', input);
  return data.data!;
}

export async function getMyNotesRequest(scope: 'active' | 'history' = 'active') {
  const { data } = await api.get<ApiResponse<Note[]>>('/notes/my-notes', { params: { scope } });
  return data.data!;
}

export async function getNoteRequest(id: string) {
  const { data } = await api.get<ApiResponse<Note>>(`/notes/${id}`);
  return data.data!;
}

export async function revokeNoteRequest(id: string) {
  const { data } = await api.delete<ApiResponse<{ id: string; isRevoked: boolean; status: string }>>(`/notes/${id}/revoke`);
  return data.data!;
}

export async function openShareRequest(token: string) {
  const { data } = await api.get<ApiResponse<Note | { requiresPassword: true; accessType: string; shareType: string }>>(`/share/${token}`);
  return data.data!;
}

export async function unlockShareRequest(token: string, input: UnlockInput) {
  const { data } = await api.post<ApiResponse<Note>>(`/share/${token}/unlock`, input);
  return data.data!;
}
