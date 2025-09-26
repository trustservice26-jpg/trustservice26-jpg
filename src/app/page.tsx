'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartChat = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CandidConnect</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Have a question? Chat live with our admin.
        </p>
        <Button size="lg" onClick={handleStartChat}>
          Chat with Admin
        </Button>
      </div>
    </div>
  );
}
