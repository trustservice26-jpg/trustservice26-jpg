'use client';

import { useState } from 'react';
import type { Message, User } from '@/lib/data';
import { users } from '@/lib/data';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleAddParticipant = (userId: string) => {
    const userToAdd = users.find(u => u.id === userId);
    if (userToAdd && !participants.some(p => p.id === userId)) {
      setParticipants(prev => [...prev, userToAdd]);
      toast({
        title: 'User Added',
        description: `${userToAdd.name} has been added to the room.`,
      })
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader
        type={chatType}
        name={chatName}
        participants={participants}
        onAddParticipant={handleAddParticipant}
      />
      <ChatMessages
        messages={messages}
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
