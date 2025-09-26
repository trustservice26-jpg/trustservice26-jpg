'use client';

import { useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { CURRENT_USER_ID, users, type Message } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ChatMessagesProps {
  messages: Message[];
  blockedUsers: string[];
  handleBlockUser: (userId: string) => void;
}

export function ChatMessages({
  messages,
  blockedUsers,
  handleBlockUser,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = messages.filter(
    (m) => !blockedUsers.includes(m.userId)
  );

  return (
    <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6">
      {filteredMessages.map((message, index) => {
        const user = users.find((u) => u.id === message.userId);
        const isCurrentUser = message.userId === CURRENT_USER_ID;

        const showAvatarAndName =
          index === 0 ||
          filteredMessages[index - 1].userId !== message.userId;

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
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </span>
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
                 {!isCurrentUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{[isCurrentUser ? 'left' : 'right']: '-2.5rem'}}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleBlockUser(message.userId)}>
                        Block User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
             <div className="w-8" />
          </div>
        );
      })}
    </div>
  );
}
