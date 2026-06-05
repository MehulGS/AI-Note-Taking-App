export type ShareType = 'ONE_TIME' | 'TIME_BASED';
export type AccessType = 'PUBLIC' | 'PASSWORD_PROTECTED';
export type ShareStatus = 'Active' | 'Expired' | 'Revoked' | 'Used';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  shareType: ShareType;
  accessType: AccessType;
  expiresAt: string;
  shareToken: string;
  viewCount: number;
  isRevoked: boolean;
  isUsed: boolean;
  status: ShareStatus;
  shareUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
