'use client';

import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { useState, use, useEffect } from 'react';
import { useUsers } from '@/contexts/user-context';
import { getMessages, getUser } from '@/lib/firestore';
import { CURRENT_USER_ID, Message, User } from '@/lib/data';

export default function DMPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const { users, loading } = useUsers();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      let user = users.find(u => u.id === resolvedParams.id);
      if (!user) {
        user = await getUser(resolvedParams.id);
      }
      if (user) {
        setOtherUser(user);
        const currentUser = users.find(u => u.id === CURRENT_USER_ID);
        if(currentUser) {
            setParticipants([currentUser, user]);
        }
      } else if (!loading) {
        notFound();
      }
    };
    if (!loading) {
        fetchUser();
    }
  }, [resolvedParams.id, users, loading]);

  useEffect(() => {
    if (otherUser) {
      const unsubscribe = getMessages(resolvedParams.id, 'dm', setMessages);
      return () => unsubscribe();
    }
  }, [resolvedParams.id, otherUser]);

  if (loading || !otherUser || participants.length === 0) {
    return <div className="flex h-full items-center justify-center"><p>Loading chat...</p></div>;
  }

  return (
    <ChatUI
      chatId={resolvedParams.id}
      chatType="dm"
      chatName={otherUser.name}
      initialMessages={messages}
      participants={participants}
    />
  );
}
