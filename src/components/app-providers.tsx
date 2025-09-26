'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash, MessageCircle, Trash2, Users, X } from 'lucide-react';

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
import { CURRENT_USER_ID, rooms, users } from '@/lib/data';
import { Button } from './ui/button';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const handleBlockUser = (userId: string) => {
    setBlockedUsers((prev) => [...prev, userId]);
    const user = users.find((u) => u.id === userId);
    toast({
      title: 'User Blocked',
      description: `You have blocked ${user?.name}. You will no longer see their messages.`,
    });
  };

  const handleUnblockUser = (userId: string) => {
    setBlockedUsers((prev) => prev.filter((id) => id !== userId));
    const user = users.find((u) => u.id === userId);
    toast({
      title: 'User Unblocked',
      description: `You have unblocked ${user?.name}.`,
    });
  };

  const isUserBlocked = (userId: string) => blockedUsers.includes(userId);

  const filteredDms = users.filter(
    (u) => u.id !== CURRENT_USER_ID && !isUserBlocked(u.id)
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
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </SidebarMenuButton>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100"
                    onClick={() => handleBlockUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </SidebarMenuItem>
              ))}
              {blockedUsers.length > 0 && (
                <>
                  <SidebarGroupLabel className="flex items-center gap-2 mt-4 text-muted-foreground">
                    Blocked Users
                  </SidebarGroupLabel>
                  {users
                    .filter((u) => isUserBlocked(u.id))
                    .map((user) => (
                      <SidebarMenuItem key={user.id}>
                        <div className="flex justify-between items-center w-full text-sm text-muted-foreground px-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={user.avatarUrl}
                                alt={user.name}
                              />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="line-through">{user.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUnblockUser(user.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    ))}
                </>
              )}
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
              participants: User[];
            }>(children)
              ? React.cloneElement(
                  children as React.ReactElement<{
                    blockedUsers: string[];
                    handleBlockUser: (userId: string) => void;
                    participants: User[];
                  }>,
                  { blockedUsers, handleBlockUser }
                )
              : children)}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
