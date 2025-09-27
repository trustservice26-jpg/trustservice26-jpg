
'use client';

import { useState, useEffect } from 'react';
import type { Message, User, Presence } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { PREDEFINED_USERS } from '@/lib/firestore';

type ChatUIProps = {
  chatId: string;
  currentUserId: string;
  initialMessages: Message[];
  presence: Presence;
};

export function ChatUI({
  chatId,
  currentUserId,
  initialMessages,
  presence,
}: ChatUIProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [participants, setParticipants] = useState<User[]>(PREDEFINED_USERS);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader
        chatId={chatId}
        currentUserId={currentUserId}
        presence={presence}
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
