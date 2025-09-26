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
  roomId?: string;
  dmId?: string; // Combination of two user IDs
};

export const CURRENT_USER_ID = 'user-1';

export const users: User[] = [
  { id: 'user-1', name: 'You', avatarUrl: 'https://picsum.photos/seed/1/200/200', isOnline: true },
  { id: 'user-2', name: 'Ben', avatarUrl: 'https://picsum.photos/seed/2/200/200', isOnline: true },
  { id: 'user-3', name: 'Chloe', avatarUrl: 'https://picsum.photos/seed/3/200/200', isOnline: false },
  { id: 'user-4', name: 'David', avatarUrl: 'https://picsum.photos/seed/4/200/200', isOnline: true },
  { id: 'user-5', name: 'Emily', avatarUrl: 'https://picsum.photos/seed/5/200/200', isOnline: false },
  { id: 'user-6', name: 'Frank', avatarUrl: 'https://picsum.photos/seed/6/200/200', isOnline: false },
  { id: 'user-7', name: 'Grace', avatarUrl: 'https://picsum.photos/seed/7/200/200', isOnline: true },
];

export const rooms: Room[] = [
  { id: 'general', name: 'general' },
];

const now = new Date();

export const messages: Message[] = [
  // General Room
  { id: 'msg-1', text: 'Welcome to the general chat!', timestamp: new Date(now.getTime() - 10 * 60000).toISOString(), userId: 'user-2', roomId: 'general' },
  { id: 'msg-2', text: 'Hey everyone!', timestamp: new Date(now.getTime() - 9 * 60000).toISOString(), userId: 'user-3', roomId: 'general' },
  { id: 'msg-3', text: 'Hello! Glad to be here.', timestamp: new Date(now.getTime() - 8 * 60000).toISOString(), userId: 'user-1', roomId: 'general' },
  
  // DM with Ben (user-2)
  { id: 'dm-1', text: 'Hey, how are you?', timestamp: new Date(now.getTime() - 5 * 60000).toISOString(), userId: 'user-1', dmId: 'user-2' },
  { id: 'dm-2', text: 'Doing great! Just working on a new project. You?', timestamp: new Date(now.getTime() - 4 * 60000).toISOString(), userId: 'user-2', dmId: 'user-1' },

  // DM with Chloe (user-3)
  { id: 'dm-3', text: 'Did you see the latest movie that came out?', timestamp: new Date(now.getTime() - 15 * 60000).toISOString(), userId: 'user-3', dmId: 'user-1' },
];

// Helper functions to get data
export const getRoomMessages = (roomId: string) => messages.filter(m => m.roomId === roomId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
export const getDmMessages = (userId1: string, userId2: string) => messages.filter(m => (m.dmId === userId1 && m.userId === userId2) || (m.dmId === userId2 && m.userId === userId1)).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
