
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
  chatId: string;
};

export type Presence = {
  [userId: string]: {
    online: boolean;
  };
};
