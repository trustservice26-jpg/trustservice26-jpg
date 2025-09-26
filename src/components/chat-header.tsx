import React from 'react';
import { Hash, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/data';

interface ChatHeaderProps {
  type: 'room' | 'dm';
  name: string;
}

export function ChatHeader({
  type,
  name,
}: ChatHeaderProps) {
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
    </div>
  );
}
