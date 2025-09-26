'use client';

import { getRoomMessages, rooms, users, CURRENT_USER_ID } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { use } from 'react';

export default function RoomPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const room = rooms.find((r) => r.id === resolvedParams.id);
  if (!room) {
    notFound();
  }

  const initialMessages = getRoomMessages(resolvedParams.id);
  const participantIds = new Set(initialMessages.map(m => m.userId));
  participantIds.add(CURRENT_USER_ID);

  const participants = Array.from(participantIds)
    .map(userId => users.find(u => u.id === userId))
    .filter(Boolean) as any[];

  return (
    <ChatUI
      chatId={room.id}
      chatType="room"
      chatName={room.name}
      initialMessages={initialMessages}
      participants={participants}
    />
  );
}
