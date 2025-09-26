'use client';

import { getDmMessages, CURRENT_USER_ID, type User } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { useState, use, useEffect } from 'react';
import { useUsers } from '@/contexts/user-context';

export default function DMPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const { users, setUsers } = useUsers();
  
  const otherUser = users.find((u) => u.id === resolvedParams.id);
  
  useEffect(() => {
    if (!otherUser) {
      const tempUser: User = { id: resolvedParams.id, name: 'New User', avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`, isOnline: true };
      if (!users.find(u => u.id === resolvedParams.id)) {
        // This is a temporary user, let's add them to the context
        setUsers(prevUsers => [...prevUsers, tempUser]);
      }
    }
  }, [resolvedParams.id, otherUser, users, setUsers]);

  // Find the user again after the effect might have run
  const finalOtherUser = users.find((u) => u.id === resolvedParams.id);
  const currentUser = users.find(u => u.id === CURRENT_USER_ID);

  if (!finalOtherUser || !currentUser) {
    // Still loading or user not found, can show a loading state or return null
    return null;
  }

  const initialMessages = getDmMessages(CURRENT_USER_ID, resolvedParams.id);
  const participants = [currentUser, finalOtherUser];

  return (
    <ChatUI
      chatId={resolvedParams.id}
      chatType="dm"
      chatName={finalOtherUser.name}
      initialMessages={initialMessages}
      participants={participants}
    />
  );
}
