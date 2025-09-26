'use client';

import { useEffect, useState, Suspense } from 'react';
import { ChatUI } from '@/components/chat-ui';
import {
  createAnonymousUser,
  getMessages,
  getUser,
  seedInitialData,
} from '@/lib/firestore';
import { ADMIN_USER_ID, Message, User } from '@/lib/data';

function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await seedInitialData();

      const admin = await getUser(ADMIN_USER_ID);
      setAdminUser(admin);

      let userId = localStorage.getItem('candid-connect-user-id');
      let user: User | null = null;
      if (userId) {
        user = await getUser(userId);
      }
      if (!user) {
        user = await createAnonymousUser();
        if(user) {
          localStorage.setItem('candid-connect-user-id', user.id);
        }
      }
      setCurrentUser(user);
      setLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getMessages(currentUser.id, setMessages);
      return () => unsubscribe();
    }
  }, [currentUser]);

  if (loading || !currentUser || !adminUser) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p>Loading your chat...</p>
      </div>
    );
  }

  return (
    <ChatUI
      chatId={currentUser.id}
      currentUserId={currentUser.id}
      chatType="dm"
      chatName="Chat with Admin"
      initialMessages={messages}
      participants={[currentUser, adminUser]}
    />
  );
}


export default function Chat() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center bg-background"><p>Loading...</p></div>}>
      <ChatPage />
    </Suspense>
  );
}
