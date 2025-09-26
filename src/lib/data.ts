export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  chatId: string;
};

// This is no longer used but kept for potential future use.
export const ADMIN_USER_ID = 'admin-user';
