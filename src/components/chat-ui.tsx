'use client';

import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { getUser } from '@/lib/firestore';

type ChatUIProps = {
  chatId: string;
  currentUserId: string;
  initialMessages: Message[];
};

export function ChatUI({
  chatId,
  currentUserId,
  initialMessages,
}: ChatUIProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const userIds = new Set(messages.map(m => m.userId));
      userIds.add(currentUserId);

      const uniqueUserIds = Array.from(userIds);

      const users = (await Promise.all(
        uniqueUserIds.map(id => getUser(id))
      )).filter(Boolean) as User[];
      
      setParticipants(users);
    };

    if (messages.length > 0 || currentUserId) {
      fetchParticipants();
    }
  }, [messages, currentUserId]);


  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        type="room"
        name={chatId}
      />
      <ChatMessages
        messages={messages}
        participants={participants}
        currentUserId={currentUserId}
      />
      <MessageInput
        userId={currentUserId}
        chatId={chatId}
      />
    </div>
  );
}
