'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash, MessageCircle, Plus, Users, Trash2 } from 'lucide-react';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CURRENT_USER_ID, type User } from '@/lib/data';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserProvider, useUsers } from '@/contexts/user-context';
import { RoomProvider, useRooms } from '@/contexts/room-context';
import { addUser } from '@/lib/firestore';

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { users, setUsers, loading: usersLoading } = useUsers();
  const { rooms, loading: roomsLoading } = useRooms();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);

  const handleDeleteUser = (userId: string) => {
    // Note: Deleting users from Firestore is not implemented in this version
    // to prevent accidental data loss in the prototype.
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast({
      title: 'User Removed',
      description: `${user?.name} has been removed from your list for this session.`,
    });
  };
  
  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (name.trim()) {
      try {
        const newUser = await addUser(name.trim());
        // No need to setUsers here, onSnapshot will handle it.
        toast({
          title: 'User Added',
          description: `${newUser.name} has been added.`,
        });
        setIsAddUserDialogOpen(false);
        form.reset();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add user.',
        });
      }
    }
  };

  const filteredDms = users.filter(
    (u) => u.id !== CURRENT_USER_ID
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
              {roomsLoading && <p className="p-2 text-xs text-muted-foreground">Loading rooms...</p>}
              {!roomsLoading && rooms.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <Link href={`/room/${room.id}`} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname === `/room/${room.id}`}
                      className="w-full capitalize"
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
              {usersLoading && <p className="p-2 text-xs text-muted-foreground">Loading users...</p>}
              {!usersLoading && filteredDms.map((user) => (
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
                  {user.id !== 'user-1' && user.id !== 'user-2' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/item:opacity-100"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the name of the new user to add them to your direct messages.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" name="name" className="col-span-3" required />
                    </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </SidebarFooter>
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
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <RoomProvider>
        <AppLayout>{children}</AppLayout>
      </RoomProvider>
    </UserProvider>
  );
}
