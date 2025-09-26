'use client';

import { getDmMessages, users as initialUsers, CURRENT_USER_ID, type User } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { useState, use } from 'react';

export default function DMPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [users, setUsers] = useState(initialUsers);
  const otherUser = users.find((u) => u.id === resolvedParams.id);
  
  if (!otherUser) {
    if (!initialUsers.find(u => u.id === resolvedParams.id)) {
      // This is a temporary user that does not exist in initialUsers
      // Let's create a temporary user object to proceed.
      const tempUser: User = { id: resolvedParams.id, name: 'New User', avatarUrl: '', isOnline: true };
      if (!users.find(u => u.id === resolvedParams.id)) {
        setUsers(prevUsers => [...prevUsers, tempUser]);
      }
    } else {
        notFound();
    }
  }

  const initialMessages = getDmMessages(CURRENT_USER_ID, resolvedParams.id);
  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  const finalOtherUser = users.find((u) => u.id === resolvedParams.id);
  
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
