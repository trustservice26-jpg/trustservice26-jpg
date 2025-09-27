
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

  useEffect(() => {
    if (!chatId) {
      setIsLoading(false);
      return;
    }

    let unsubMessages: () => void;
    let unsubPresence: () => void;
    let user: User | null = null;

    const initialize = async () => {
      try {
        // 1. Initialize User
        user = await getOrCreateUserForChat(chatId);
        setCurrentUser(user);
        
        toast({
            title: 'Welcome!',
            description: `You've joined the chat as ${user.name}.`,
            duration: 5000,
        });

        // 2. Subscribe to Messages and Presence
        unsubMessages = getMessages(chatId, setMessages);
        unsubPresence = subscribeToPresence(chatId, setPresence);

        // 3. Set user as online
        updatePresence(chatId, user.id, true);

      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initialize your chat session. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // 4. Cleanup function
    return () => {
      if (unsubMessages) unsubMessages();
      if (unsubPresence) unsubPresence();
      if (user) {
        updatePresence(chatId, user.id, false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
            <p className="text-xl">Loading your secure chat...</p>
            <p className="text-sm text-muted-foreground mt-2">Initializing session...</p>
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
