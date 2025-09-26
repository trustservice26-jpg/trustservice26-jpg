import { getRoomMessages, rooms, users } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';

export default function RoomPage({ params }: { params: { id: string } }) {
  const room = rooms.find((r) => r.id === params.id);
  if (!room) {
    notFound();
  }

  const initialMessages = getRoomMessages(params.id);
  const participants = Array.from(new Set(initialMessages.map(m => m.userId)))
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
