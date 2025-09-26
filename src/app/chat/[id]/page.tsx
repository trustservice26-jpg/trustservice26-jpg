'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAnonymousUser, getUser } from '@/lib/firestore';
import { v4 as uuidv4 } from 'uuid';

export default function JoinChatPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatId = params.id as string;

  const handleJoinWithId = async () => {
    if (!userId.trim()) {
      toast({
        variant: 'destructive',
        title: 'User ID is required',
        description: 'Please enter your User ID to continue.',
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

  const handleCreateAndJoin = async () => {
    setIsLoading(true);
    try {
      const newUser = await createAnonymousUser();
      toast({
          title: 'New User Created!',
          description: `Your new User ID is: ${newUser.id}. Save it to log in from other devices.`,
          duration: 9000,
      })
      router.push(`/chat/${chatId}/${newUser.id}`);
    } catch (error) {
      console.error("Failed to create new user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create a new user.",
      })
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-4">
      <Card className="max-w-sm w-full bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Join Chat Room</CardTitle>
          <CardDescription>
            Join as a new user or enter an existing User ID to continue a previous session.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4">
            <Button size="lg" onClick={handleCreateAndJoin} disabled={isLoading} className="h-12 text-lg font-semibold">
              {isLoading ? 'Creating User...' : 'Join as New User'}
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
            
            <div className="flex flex-col gap-2">
                <p className="text-sm text-center text-muted-foreground">Have an ID? Join with it here.</p>
                <Input
                  type="text"
                  placeholder="Enter existing User ID..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="text-center bg-input border-border h-12 text-base"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinWithId();
                    }
                  }}
                />
                <Button variant="secondary" onClick={handleJoinWithId} disabled={isLoading || !userId.trim()} className="h-12 text-lg font-semibold">
                  {isLoading ? 'Joining...' : 'Join with ID'}
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
