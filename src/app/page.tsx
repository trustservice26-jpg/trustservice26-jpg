'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import {
  createAnonymousUser,
  getMessages,
  getUser,
  seedInitialData,
} from '@/lib/firestore';
import { ADMIN_USER_ID, Message, User } from '@/lib/data';

function ChatPage() {
  const searchParams = useSearchParams();
  const isAdminView = searchParams.get('admin') === 'true';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await seedInitialData();

      const admin = await getUser(ADMIN_USER_ID);
      setAdminUser(admin);

      if (isAdminView) {
        setCurrentUser(admin);
        setLoading(false);
        return;
      }

      let userId = localStorage.getItem('candid-connect-user-id');
      let user: User | null = null;
      if (userId) {
        user = await getUser(userId);
      }
      if (!user) {
        user = await createAnonymousUser();
        localStorage.setItem('candid-connect-user-id', user.id);
      }
      setCurrentUser(user);
      setLoading(false);
    };

    initializeApp();
  }, [isAdminView]);

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
  
  // For the admin, we need to show a list of chats, which is not implemented yet.
  // For now, we will show a placeholder message.
  if (isAdminView) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p>Welcome, Admin. Your dashboard with all user chats will be shown here.</p>
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


export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center bg-background"><p>Loading...</p></div>}>
      <ChatPage />
    </Suspense>
  );
}
