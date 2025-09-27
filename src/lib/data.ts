export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  chatId: string; // This will now be populated on the client
};
