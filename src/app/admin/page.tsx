'use client';

import { useEffect, useState } from 'react';
import {
  getAllUsers,
  getMessages,
  getUser,
  seedInitialData,
} from '@/lib/firestore';
import { ADMIN_USER_ID, Message, User } from '@/lib/data';
import { ChatUI } from '@/components/chat-ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function AdminPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await seedInitialData();
      const admin = await getUser(ADMIN_USER_ID);
      setAdminUser(admin);

      const unsubscribeUsers = getAllUsers((users) => {
        setAllUsers(users.filter((u) => u.id !== ADMIN_USER_ID));
      });
      
      setLoading(false);
      return () => unsubscribeUsers();
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const unsubscribeMessages = getMessages(selectedUser.id, setMessages);
      return () => unsubscribeMessages();
    }
  }, [selectedUser]);

  if (loading || !adminUser) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background text-foreground">
      <aside className="w-80 border-r border-border flex flex-col">
        <header className="p-4 border-b">
          <h2 className="text-xl font-bold">User Chats</h2>
        </header>
        <div className="flex-1 overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={cn(
                'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted',
                selectedUser?.id === user.id && 'bg-muted'
              )}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{user.name}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatUI
            chatId={ADMIN_USER_ID}
            currentUserId={ADMIN_USER_ID}
            chatType="dm"
            chatName={`Chat with ${selectedUser.name}`}
            initialMessages={messages}
            participants={[adminUser, selectedUser]}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p>Select a user to view the chat.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center bg-background"><p>Loading...</p></div>}>
            <AdminPage />
        </Suspense>
    )
}
