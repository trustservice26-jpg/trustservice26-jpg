'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAnonymousUser, getUser } from '@/lib/firestore';

export default function JoinChatPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatId = params.id as string;

  const handleJoin = async () => {
    if (!userId.trim()) {
      toast({
        variant: 'destructive',
        title: 'User ID is required',
        description: 'Please enter a User ID to join the chat.',
      });
      return;
    }
    setIsLoading(true);
    const user = await getUser(userId.trim());
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'User not found',
            description: 'The provided User ID does not exist. Please check the ID or create a new user.',
        });
        setIsLoading(false);
        return;
    }
    router.push(`/chat/${chatId}/${userId.trim()}`);
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    const newUser = await createAnonymousUser();
    toast({
        title: 'New User Created!',
        description: `Your new User ID is: ${newUser.id}. Save it to log in from other devices.`,
    })
    router.push(`/chat/${chatId}/${newUser.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-4">
      <Card className="max-w-sm w-full bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Join Chat: #{chatId}</CardTitle>
          <CardDescription>
            Enter your User ID to join the chat, or create a new user to begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your User ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="text-center bg-input border-border h-12 text-lg"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJoin();
                }
              }}
            />
            <Button size="lg" onClick={handleJoin} disabled={isLoading} className="h-12 text-lg font-semibold">
              {isLoading ? 'Joining...' : 'Join with User ID'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button variant="secondary" size="lg" onClick={handleCreateUser} disabled={isLoading} className="h-12 text-lg font-semibold">
              {isLoading ? 'Creating...' : 'Create a New User'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
