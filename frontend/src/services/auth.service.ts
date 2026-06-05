import type { LoginInput, RegisterInput } from '@/schemas/auth.schema';
import type { ApiResponse, User } from '@/types';
import { api } from './api';

export type AuthPayload = { token: string; user: User };

export async function registerRequest(input: RegisterInput) {
  const { data } = await api.post<ApiResponse<AuthPayload>>('/auth/register', input);
  return data.data!;
}

export async function loginRequest(input: LoginInput) {
  const { data } = await api.post<ApiResponse<AuthPayload>>('/auth/login', input);
  return data.data!;
}
