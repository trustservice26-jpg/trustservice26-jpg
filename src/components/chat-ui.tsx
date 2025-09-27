'use client';

import { useState, useEffect } from 'react';
import type { Message, User } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { PREDEFINED_USERS } from '@/lib/firestore';

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
  const [participants, setParticipants] = useState<User[]>(PREDEFINED_USERS);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // The participants are now pre-set to the two defined users,
  // so no complex effect is needed to fetch them. This is more robust.
  
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
