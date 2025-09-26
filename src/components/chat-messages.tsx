'use client';

import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { type Message, type User } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


interface ChatMessagesProps {
  messages: Message[];
  participants: User[];
  currentUserId: string;
}

function FormattedTimestamp({ timestamp }: { timestamp: string }) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    if (timestamp) {
      setFormattedTime(format(new Date(timestamp), 'h:mm a'));
    }
  }, [timestamp]);

  if (!formattedTime) {
    return null;
  }

  return <span className="text-xs text-muted-foreground">{formattedTime}</span>;
}

export function ChatMessages({
  messages,
  participants,
  currentUserId,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message, index) => {
        const user = participants.find((u) => u.id === message.userId);
        const isCurrentUser = message.userId === currentUserId;

        const showAvatarAndName =
          index === 0 ||
          messages[index - 1].userId !== message.userId;

        return (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              isCurrentUser && 'flex-row-reverse'
            )}
          >
            {showAvatarAndName ? (
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? user.name[0] : 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-8" />
            )}

            <div
              className={cn(
                'flex flex-col',
                isCurrentUser ? 'items-end' : 'items-start'
              )}
            >
              {showAvatarAndName && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{user?.name}</span>
                  <FormattedTimestamp timestamp={message.timestamp} />
                </div>
              )}
              <div
                className={cn(
                  'group relative max-w-sm md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 text-sm',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card border rounded-bl-none'
                )}
              >
                {message.text}
              </div>
            </div>
             <div className="w-8" />
          </div>
        );
      })}
    </div>
  );
}
