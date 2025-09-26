import { Hash, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import type { User } from '@/lib/data';

interface ChatHeaderProps {
  type: 'room' | 'dm';
  name: string;
  participants: User[];
}

export function ChatHeader({ type, name, participants }: ChatHeaderProps) {
  const icon =
    type === 'room' ? (
      <Hash className="w-6 h-6 text-muted-foreground" />
    ) : (
      <UserIcon className="w-6 h-6 text-muted-foreground" />
    );

  const title = type === 'room' ? `# ${name}` : name;

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
      </div>
    </div>
  );
}
