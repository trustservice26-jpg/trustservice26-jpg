'use client';

import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { getUser, PREDEFINED_USERS } from '@/lib/firestore';

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
      const userIdsInChat = Array.from(new Set(messages.map(m => m.userId)));

      if (!userIdsInChat.includes(currentUserId)) {
          userIdsInChat.push(currentUserId);
      }
      
      const users = (await Promise.all(
        userIdsInChat.map(id => getUser(id))
      )).filter((user): user is User => user !== null);
      
      const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());

      // Ensure both predefined users are always available as participants
      const allPossibleParticipants = [...PREDEFINED_USERS];
      for (const user of uniqueUsers) {
          if (!allPossibleParticipants.find(p => p.id === user.id)) {
              allPossibleParticipants.push(user);
          }
      }
      
      setParticipants(allPossibleParticipants);
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
