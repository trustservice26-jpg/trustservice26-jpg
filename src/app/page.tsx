'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAnonymousUser } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleStartChat = async () => {
    if (!userName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Username is required',
        description: 'Please enter a name to start chatting.',
      });
      return;
    }

    setIsCreatingUser(true);
    try {
      const user = await createAnonymousUser(userName);
      localStorage.setItem('candid-connect-user-id', user.id);
      router.push('/chat');
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create user. Please try again.',
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground">
      <div className="text-center max-w-sm w-full p-4">
        <h1 className="text-4xl font-bold mb-4">CandidConnect</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Have a question? Enter your name and chat live with our admin.
        </p>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter your name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center"
            disabled={isCreatingUser}
          />
          <Button size="lg" onClick={handleStartChat} disabled={isCreatingUser}>
            {isCreatingUser ? 'Starting Chat...' : 'Chat with Admin'}
          </Button>
        </div>
      </div>
    </div>
  );
}
