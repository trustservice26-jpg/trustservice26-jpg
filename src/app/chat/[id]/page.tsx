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
      // No need to set loading to true here, it's already true by default.
      try {
        let user: User | null = null;
        const storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);

        if (storedUserId) {
          // If there's a user ID in storage, try to fetch the user.
          user = await getUser(storedUserId);
        }

        // If no user was found with the stored ID, or if there was no stored ID,
        // create a new anonymous user.
        if (!user) {
          const newUser = await createAnonymousUser();
          localStorage.setItem(USER_ID_STORAGE_KEY, newUser.id);
          user = newUser; // Assign the newly created user
          toast({
            title: 'Welcome!',
            description: `You've joined the chat as ${newUser.name}. Your identity is anonymous.`,
            duration: 5000,
          });
        }
        
        // By this point, `user` is guaranteed to be a valid User object.
        setCurrentUser(user);
        
      } catch (error) {
        console.error("Failed to initialize user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initialize your user session. Please refresh the page.",
        });
      } finally {
        // This is crucial: ALWAYS set loading to false, whether it succeeds or fails.
        setLoading(false);
      }
    };

    initializeUser();
    // The dependency array should be empty to ensure this runs only once on mount.
    // Toast is a stable function and doesn't need to be in the array.
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = getMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
            <p className="text-xl">Loading your secure chat...</p>
            <p className="text-sm text-muted-foreground mt-2">Just a moment while we connect you.</p>
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
