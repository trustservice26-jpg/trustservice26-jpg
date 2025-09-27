
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { getMessages, getOrCreateUserForChat, subscribeToPresence, updatePresence } from '@/lib/firestore';
import { Message, User, Presence } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function ChatRoomPage() {
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [presence, setPresence] = useState<Presence>({});

  const chatId = params.id as string;

  // Effect for handling user initialization
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      if (!chatId) return;

      try {
        const user = await getOrCreateUserForChat(chatId);
        setCurrentUser(user);
        
        toast({
            title: 'Welcome!',
            description: `You've joined the chat as ${user.name}.`,
            duration: 5000,
        });

      } catch (error) {
        console.error("Failed to initialize user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initialize your user session. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Effect for chat messages and presence
  useEffect(() => {
    if (!isLoading && currentUser && chatId) {
      const unsubMessages = getMessages(chatId, setMessages);
      const unsubPresence = subscribeToPresence(chatId, setPresence);

      // Set user as online
      updatePresence(chatId, currentUser.id, true);

      // Set user as offline on unload
      const handleBeforeUnload = () => {
        updatePresence(chatId, currentUser.id, false);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        unsubMessages();
        unsubPresence();
        // Set user as offline on component unmount
        updatePresence(chatId, currentUser.id, false);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isLoading, currentUser, chatId]);

  if (isLoading) {
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
      presence={presence}
    />
  );
}
