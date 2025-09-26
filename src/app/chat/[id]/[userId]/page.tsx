'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import {
  getMessages,
  getUser,
} from '@/lib/firestore';
import { Message, User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export default function ChatRoomPage() {
  const params = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const chatId = params.id as string;
  const userId = params.userId as string;

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      if (!userId) {
        console.error("User ID is missing from URL");
        setLoading(false);
        return;
      }
      
      try {
        const user = await getUser(userId);
        if (user) {
          setCurrentUser(user);
        } else {
          toast({
            variant: "destructive",
            title: "User not found",
            description: "This user ID does not exist. You may need to create a new user.",
          });
        }
      } catch (error) {
        console.error("Failed to initialize user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch user data.",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [userId, toast]);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = getMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId]);

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    toast({
      title: 'User ID Copied!',
      description: 'You can now use this ID to log in from another device.',
    });
  };

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
          <p>The user ID was not found or an error occurred.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
        <ChatUI
        chatId={chatId}
        currentUserId={currentUser.id}
        initialMessages={messages}
        />
        <div className="p-2 border-t bg-card text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
                <span>Your User ID: <span className="font-mono bg-muted p-1 rounded">{currentUser.id}</span></span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUserId}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <p className='mt-1'>Save this ID to continue your chat on any device.</p>
        </div>
    </div>
  );
}
