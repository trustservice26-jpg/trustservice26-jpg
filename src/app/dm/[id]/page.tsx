'use client';

import { getDmMessages, users as initialUsers, CURRENT_USER_ID } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { useState } from 'react';

export default function DMPage({ params }: { params: { id: string } }) {
  const [users, setUsers] = useState(initialUsers);
  const otherUser = users.find((u) => u.id === params.id);
  
  if (!otherUser || otherUser.id === CURRENT_USER_ID) {
    // This is a temporary fix. In a real app, you'd fetch users from a database
    // and might not see this issue. We check against initialUsers as a fallback.
    if (!initialUsers.find(u => u.id === params.id)) {
      notFound();
    }
  }

  const initialMessages = getDmMessages(CURRENT_USER_ID, params.id);
  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  
  const participants = [currentUser, otherUser].filter(Boolean) as any[];

  return (
    <ChatUI
      chatId={params.id}
      chatType="dm"
      chatName={otherUser?.name || 'DM'}
      initialMessages={initialMessages}
      participants={participants}
    />
  );
}
