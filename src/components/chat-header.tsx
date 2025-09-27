import React from 'react';
import { Hash } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';


interface ChatHeaderProps {
  type: 'room';
  name: string;
}

export function ChatHeader({
  name,
}: ChatHeaderProps) {

  return (
    <div className="flex items-center h-16 px-4 border-b shrink-0 bg-card">
      <Button asChild variant="ghost" size="icon" className="md:hidden mr-2">
        <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back</span>
        </Link>
      </Button>
      <div className="flex items-center gap-3">
        <Hash className="w-6 h-6 text-muted-foreground" />
        <h2 className="text-xl font-semibold font-headline truncate">{name}</h2>
      </div>
    </div>
  );
}
