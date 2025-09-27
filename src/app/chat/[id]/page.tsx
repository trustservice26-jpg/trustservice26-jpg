'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { getMessages, getUser, createAnonymousUser } from '@/lib/firestore';
import { Message, User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const USER_ID_STORAGE_KEY = 'candid-connect-user-id';

export default function ChatRoomPage() {
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const chatId = params.id as string;

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
      let user: User | null = null;

      if (userId) {
        try {
          user = await getUser(userId);
        } catch (error) {
          console.error("Failed to fetch existing user:", error);
          // If fetching fails, we'll create a new user.
        }
      }

      if (!user) {
        try {
          const newUser = await createAnonymousUser();
          localStorage.setItem(USER_ID_STORAGE_KEY, newUser.id);
          user = newUser;
          toast({
            title: 'Welcome!',
            description: `You've joined the chat as ${newUser.name}. Your identity is anonymous.`,
            duration: 5000,
          });
        } catch (error) {
          console.error("Failed to create a new anonymous user:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not initialize your user session. Please refresh the page.",
          });
          setLoading(false);
          return;
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    };

    initializeUser();
  }, [toast]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = getMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p>Loading your secure chat...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-4">Could not load chat.</h2>
          <p>An error occurred while setting up your user identity.</p>
        </div>
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
