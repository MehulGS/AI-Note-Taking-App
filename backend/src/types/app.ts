import type { Types } from 'mongoose';

export type ShareType = 'ONE_TIME' | 'TIME_BASED';
export type AccessType = 'PUBLIC' | 'PASSWORD_PROTECTED';
export type ShareStatus = 'Active' | 'Expired' | 'Revoked' | 'Used';

export type JwtUser = {
  userId: string;
  email: string;
};

export type AuthVariables = {
  user: JwtUser;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type MongoId = Types.ObjectId | string;
