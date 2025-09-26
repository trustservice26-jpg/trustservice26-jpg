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
      const tempUser: User = { id: resolvedParams.id, name: 'New User', avatarUrl: '', isOnline: true };
      if (!users.find(u => u.id === resolvedParams.id)) {
        // This is a temporary user, let's add them to the context
        setUsers(prevUsers => [...prevUsers, tempUser]);
      }
    }
  }, [resolvedParams.id, otherUser, users, setUsers]);


  const initialMessages = getDmMessages(CURRENT_USER_ID, resolvedParams.id);
  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  const finalOtherUser = users.find((u) => u.id === resolvedParams.id);
  
  if (!finalOtherUser) {
    // Still loading or not found, can show a loading state
    return null;
  }

  const participants = [currentUser, finalOtherUser].filter(Boolean) as any[];

  return (
    <ChatUI
      chatId={resolvedParams.id}
      chatType="dm"
      chatName={finalOtherUser?.name || 'DM'}
      initialMessages={initialMessages}
      participants={participants}
    />
  );
}