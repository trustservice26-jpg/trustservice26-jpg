'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { sendMessage } from '@/lib/actions';
import type { Message } from '@/lib/data';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  chatId: string;
  chatType: 'room' | 'dm';
  onNewMessage: (message: Message) => void;
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
  chatId,
  chatType,
  onNewMessage,
}: MessageInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleAction = async (formData: FormData) => {
    const text = formData.get('message') as string;
    if (!text || text.trim() === '') return;

    const result = await sendMessage(text, chatId, chatType);

    if (result.success && result.newMessage) {
      onNewMessage(result.newMessage);
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
