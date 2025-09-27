
import React from 'react';
import { Hash, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { PREDEFINED_USERS } from '@/lib/firestore';
import type { Presence, User } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  chatId: string;
  currentUserId: string;
  presence: Presence;
}

const OtherUserStatus = ({
  currentUserId,
  presence,
}: {
  currentUserId: string;
  presence: Presence;
}) => {
  const otherUser = PREDEFINED_USERS.find(u => u.id !== currentUserId);
  if (!otherUser) return null;

  const isOnline = presence[otherUser.id]?.online;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn("h-2.5 w-2.5 rounded-full", isOnline ? 'bg-green-500' : 'bg-gray-500')} />
        <span>{otherUser.name} is {isOnline ? 'online' : 'offline'}</span>
    </div>
  );
};


export function ChatHeader({
  chatId,
  currentUserId,
  presence,
}: ChatHeaderProps) {

  return (
    <div className="flex items-center h-16 px-4 border-b shrink-0 bg-card">
      <Button asChild variant="ghost" size="icon" className="md:hidden mr-2">
        <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back</span>
        </Link>
      </Button>
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold font-headline truncate">{chatId}</h2>
        </div>
        <OtherUserStatus currentUserId={currentUserId} presence={presence} />
      </div>
    </div>
  );
}
