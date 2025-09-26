'use client';

import { useState } from 'react';
import type { Message, User } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';

type ChatUIProps = {
  chatId: string;
  chatType: 'room' | 'dm';
  chatName: string;
  initialMessages: Message[];
  participants: User[];
  blockedUsers?: string[];
  handleBlockUser?: (userId: string) => void;
};

export function ChatUI({
  chatId,
  chatType,
  chatName,
  initialMessages,
  participants: initialParticipants,
  blockedUsers = [],
  handleBlockUser = () => {},
}: ChatUIProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [participants, setParticipants] = useState(initialParticipants);

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        type={chatType}
        name={chatName}
      />
      <ChatMessages
        messages={messages}
        participants={participants}
        blockedUsers={blockedUsers}
        handleBlockUser={handleBlockUser}
      />
      <MessageInput
        chatId={chatId}
        chatType={chatType}
        onNewMessage={handleNewMessage}
      />
    </div>
  );
}
