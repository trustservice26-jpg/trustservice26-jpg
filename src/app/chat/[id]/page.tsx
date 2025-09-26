
'use client';

import { useEffect, useState, Suspense } from 'react';
import { ChatUI } from '@/components/chat-ui';
import {
  createAnonymousUser,
  getMessages,
  getUser,
} from '@/lib/firestore';
import { Message, User } from '@/lib/data';

function PrivateChatPage({ params }: { params: { id: string } }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const chatId = params.id;

  useEffect(() => {
    const initializeUser = async () => {
      let userId = localStorage.getItem('private-chat-user-id');
      let user: User | null = null;
      if (userId) {
        user = await getUser(userId);
      }
      if (!user) {
        user = await createAnonymousUser();
        if (user) {
          localStorage.setItem('private-chat-user-id', user.id);
        }
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


export default function ChatRoom({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center bg-background"><p>Loading...</p></div>}>
      <PrivateChatPage params={params} />
    </Suspense>
  );
}
