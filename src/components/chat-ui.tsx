'use client';

import { useState, useEffect } from 'react';
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
  
  // Use useEffect to update messages when initialMessages prop changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleNewMessage = (newMessage: Message) => {
    // With real-time updates from Firestore, we no longer need to manually add messages.
    // The onSnapshot listener in the page component will handle it.
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        type={chatType}
        name={chatName}
      />
      <ChatMessages
        messages={messages}
        participants={initialParticipants}
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
