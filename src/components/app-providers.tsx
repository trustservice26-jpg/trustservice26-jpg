'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash, MessageCircle, Trash2, Users } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CURRENT_USER_ID, rooms, users, type User } from '@/lib/data';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [deletedUsers, setDeletedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const handleDeleteUser = (userId: string) => {
    setDeletedUsers((prev) => [...prev, userId]);
    const user = users.find((u) => u.id === userId);
    toast({
      title: 'User Removed',
      description: `You have removed ${user?.name} from your direct messages.`,
    });
  };

  const isUserDeleted = (userId: string) => deletedUsers.includes(userId);

  const filteredDms = users.filter(
    (u) => u.id !== CURRENT_USER_ID && !isUserDeleted(u.id)
  );

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold font-headline">
              CandidConnect
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Hash />
                Chat Rooms
              </SidebarGroupLabel>
              {rooms.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <Link href={`/room/${room.id}`} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname === `/room/${room.id}`}
                      className="w-full"
                    >
                      <span># {room.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Users />
                Direct Messages
              </SidebarGroupLabel>
              {filteredDms.map((user) => (
                <SidebarMenuItem key={user.id} className="group/item">
                  <Link href={`/dm/${user.id}`} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname === `/dm/${user.id}`}
                      className="flex justify-start items-center gap-3 w-full"
                    >
                      <div className="relative">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-sidebar-background',
                            user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          )}
                        />
                      </div>
                      <span>{user.name}</span>
                    </SidebarMenuButton>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <header className="flex items-center h-14 px-4 border-b lg:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2 mx-auto">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold font-headline">
                CandidConnect
              </h1>
            </div>
          </header>
          {children &&
            (React.isValidElement<{
              blockedUsers: string[];
              handleBlockUser: (userId: string) => void;
            }>(children)
              ? React.cloneElement(
                  children as React.ReactElement<{
                    blockedUsers: string[];
                    handleBlockUser: (userId: string) => void;
                  }>,
                  { blockedUsers, handleBlockUser: setBlockedUsers }
                )
              : children)}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
