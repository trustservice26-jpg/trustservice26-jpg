export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
};

export type Room = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  dmId?: string;
};

export const ADMIN_USER_ID = 'admin-user';
