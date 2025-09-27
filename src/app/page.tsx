'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [chatId, setChatId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    if (!chatId.trim()) {
      toast({
        variant: 'destructive',
        title: 'Chat ID is required',
        description: 'Please enter a secret Chat ID to create or join a chat.',
      });
      return;
    }

    setIsLoading(true);
    router.push(`/chat/${chatId.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-4">
      <Card className="max-w-sm w-full bg-card border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">CandidConnect</CardTitle>
          <CardDescription>
            Enter a secret Chat ID to create or join a private conversation. Only those who know the ID can join.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your secret Chat ID..."
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="text-center bg-input border-border h-12 text-lg"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleStartChat();
                }
              }}
            />
            <Button size="lg" onClick={handleStartChat} disabled={isLoading} className="h-12 text-lg font-semibold">
              {isLoading ? 'Entering Chat...' : 'Start / Join Chat'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
