'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { sendMessage } from '@/lib/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  userId: string;
  onNewMessage: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} aria-label="Send message">
      <Send className="w-5 h-5" />
    </Button>
  );
}

export function MessageInput({
  userId,
  onNewMessage,
}: MessageInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = async (formData: FormData) => {
    const text = formData.get('message') as string;
    if (!text || text.trim() === '') return;

    // In a DM context, the `chatId` is the other user's ID.
    // However, the `sendMessage` action needs the current user's ID.
    // Since this component is used in the ChatUI, the `userId` prop
    // is the ID of the current user's chat, which for a DM, is the user's own ID.
    const result = await sendMessage(text, userId);

    if (result.success) {
      onNewMessage();
      formRef.current?.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to send message.',
      });
    }
  };

  return (
    <div className="p-4 border-t bg-card">
      <form
        ref={formRef}
        action={handleAction}
        className="flex items-center gap-2"
      >
        <Textarea
          name="message"
          placeholder="Type your message..."
          className="flex-1 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <SubmitButton />
      </form>
    </div>
  );
}
