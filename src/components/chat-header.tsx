import { Hash, User as UserIcon, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import type { User } from '@/lib/data';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { users } from '@/lib/data';
import React from 'react';

interface ChatHeaderProps {
  type: 'room' | 'dm';
  name: string;
  participants: User[];
  onAddParticipant?: (userId: string) => void;
}

export function ChatHeader({
  type,
  name,
  participants,
  onAddParticipant,
}: ChatHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const icon =
    type === 'room' ? (
      <Hash className="w-6 h-6 text-muted-foreground" />
    ) : (
      <UserIcon className="w-6 h-6 text-muted-foreground" />
    );

  const title = type === 'room' ? `# ${name}` : name;
  const availableUsers = users.filter(
    (u) => !participants.some((p) => p.id === u.id)
  );

  const handleAddUser = (userId: string) => {
    onAddParticipant?.(userId);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center h-14 px-4 border-b shrink-0">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-lg font-semibold font-headline">{title}</h2>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <TooltipProvider>
          {participants.map((p) => (
            <Tooltip key={p.id}>
              <TooltipTrigger>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={p.avatarUrl} alt={p.name} />
                  <AvatarFallback>{p.name[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{p.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {type === 'room' && onAddParticipant && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserPlus className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Member</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add member to #{name}</DialogTitle>
                <DialogDescription>
                  Select a user to add to this chat room.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <Button
                      key={user.id}
                      variant="outline"
                      className="flex justify-start items-center gap-3"
                      onClick={() => handleAddUser(user.id)}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All users are already in this room.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
