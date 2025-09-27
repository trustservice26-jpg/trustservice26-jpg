
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
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { toast } = useToast();

  const chatId = params.id as string;

  // Effect for handling user initialization
  useEffect(() => {
    const initializeUser = async () => {
      setIsUserLoading(true);
      try {
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
        let user: User | null = null;

        if (storedUserId) {
          user = await getUser(storedUserId);
        }

        if (!user) {
          const newUser = await createAnonymousUser();
          localStorage.setItem(USER_ID_STORAGE_KEY, newUser.id);
          user = newUser;
          toast({
            title: 'Welcome!',
            description: `You've joined the chat as ${newUser.name}. Your identity is anonymous.`,
            duration: 5000,
          });
        }
        
        setCurrentUser(user);

      } catch (error) {
        console.error("Failed to initialize user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initialize your user session. Please refresh the page.",
        });
      } finally {
        setIsUserLoading(false);
      }
    };

    initializeUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount

  // Effect for subscribing to chat messages, runs only after user is initialized
  useEffect(() => {
    if (!isUserLoading && currentUser && chatId) {
      const unsubscribe = getMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [isUserLoading, currentUser, chatId]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
            <p className="text-xl">Loading your secure chat...</p>
            <p className="text-sm text-muted-foreground mt-2">Initializing user session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-4">Could not load chat.</h2>
          <p>An error occurred while setting up your user identity. Please try refreshing the page.</p>
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
