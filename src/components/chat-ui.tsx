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
      // Get all unique user IDs from messages
      const userIdsInChat = Array.from(new Set(messages.map(m => m.userId)));

      // Ensure the current user is included, even if they haven't sent a message
      if (!userIdsInChat.includes(currentUserId)) {
          userIdsInChat.push(currentUserId);
      }
      
      const users = (await Promise.all(
        userIdsInChat.map(id => getUser(id))
      )).filter((user): user is User => user !== null);
      
      setParticipants(users);
    };

    fetchParticipants();
  }, [messages, currentUserId]);


  return (
    <div className="flex flex-col h-screen bg-background">
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
