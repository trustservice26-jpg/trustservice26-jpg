'use client';

import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';

type ChatUIProps = {
  chatId: string;
  currentUserId: string;
  chatType: 'room' | 'dm';
  chatName: string;
  initialMessages: Message[];
  participants: User[];
  blockedUsers?: string[];
  handleBlockUser?: (userId: string) => void;
};

export function ChatUI({
  chatId,
  currentUserId,
  chatType,
  chatName,
  initialMessages,
  participants: initialParticipants,
  blockedUsers = [],
  handleBlockUser = () => {},
}: ChatUIProps) {
  const [messages, setMessages] = useState(initialMessages);
  
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        type={chatType}
        name={chatName}
      />
      <ChatMessages
        messages={messages}
        participants={initialParticipants}
        currentUserId={currentUserId}
        blockedUsers={blockedUsers}
        handleBlockUser={handleBlockUser}
      />
      <MessageInput
        userId={chatId}
        onNewMessage={() => {}}
      />
    </div>
  );
}
