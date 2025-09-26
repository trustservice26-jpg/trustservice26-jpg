
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import {
  createAnonymousUser,
  getMessages,
  getUser,
} from '@/lib/firestore';
import { Message, User } from '@/lib/data';

export default function PrivateChatPage() {
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const chatId = params.id as string;

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      let userId = localStorage.getItem('private-chat-user-id');
      let user: User | null = null;

      if (userId) {
        user = await getUser(userId);
      }
      
      if (!user) {
        user = await createAnonymousUser();
        localStorage.setItem('private-chat-user-id', user.id);
      }
      
      setCurrentUser(user);
      setLoading(false);
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = getMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  if (loading || !currentUser) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p>Loading your secure chat...</p>
      </div>
    );
  }

  return (
    <ChatUI
      chatId={chatId}
      currentUserId={currentUser.id}
      initialMessages={messages}
    />
  );
}
