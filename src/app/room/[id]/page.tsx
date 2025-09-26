'use client';

import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';
import { useState, use, useEffect } from 'react';
import { useUsers } from '@/contexts/user-context';
import { getMessages, getRooms } from '@/lib/firestore';
import type { Message, Room, User } from '@/lib/data';
import { CURRENT_USER_ID } from '@/lib/data';

export default function RoomPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const { users, loading: usersLoading } = useUsers();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      const rooms = await getRooms();
      const currentRoom = rooms.find((r) => r.id === resolvedParams.id);
      if (currentRoom) {
        setRoom(currentRoom);
      } else {
        notFound();
      }
    };
    fetchRoom();
  }, [resolvedParams.id]);
  
  useEffect(() => {
    if (room) {
      const unsubscribe = getMessages(room.id, 'room', (newMessages) => {
        setMessages(newMessages);
        
        if (!usersLoading) {
            const participantIds = new Set(newMessages.map(m => m.userId));
            participantIds.add(CURRENT_USER_ID);

            const resolvedParticipants = Array.from(participantIds)
                .map(userId => users.find(u => u.id === userId))
                .filter(Boolean) as User[];
            
            setParticipants(resolvedParticipants);
            setLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, [room, users, usersLoading]);

  if (loading || usersLoading) {
    return <div className="flex h-full items-center justify-center"><p>Loading room...</p></div>;
  }
  
  if (!room) {
    return notFound();
  }

  return (
    <ChatUI
      chatId={room.id}
      chatType="room"
      chatName={room.name}
      initialMessages={messages}
      participants={participants}
    />
  );
}
