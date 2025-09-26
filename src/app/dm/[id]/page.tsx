import { getDmMessages, users, CURRENT_USER_ID } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatUI } from '@/components/chat-ui';

export default function DMPage({ params }: { params: { id: string } }) {
  const otherUser = users.find((u) => u.id === params.id);
  if (!otherUser || otherUser.id === CURRENT_USER_ID) {
    notFound();
  }

  const initialMessages = getDmMessages(CURRENT_USER_ID, otherUser.id);
   const currentUser = users.find(u => u.id === CURRENT_USER_ID);
   const participants = [currentUser, otherUser].filter(Boolean) as any[];

  return (
    <ChatUI
      chatId={otherUser.id}
      chatType="dm"
      chatName={otherUser.name}
      initialMessages={initialMessages}
      participants={participants}
    />
  );
}
