'use client';

import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { sendMessage } from '@/lib/actions';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  userId: string;
  chatId: string;
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
  chatId,
}: MessageInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleAction = async (formData: FormData) => {
    // Use the state for the message text, not formData
    const messageText = text;
    if (!messageText || !messageText.trim()) return;

    // Manually append to formData right before sending if needed by server action,
    // but here we can just pass it directly.
    const result = await sendMessage(messageText, userId, chatId);

    if (result.success) {
      // Clear the state, which controls the textarea
      setText('');
      formRef.current?.reset(); // Also reset form for good measure
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
        onSubmit={(e) => {
            // Prevent default form submission if we're handling it via action
            // This can help in some complex scenarios, but `action` should handle it.
        }}
      >
        <Textarea
          name="message"
          placeholder="Type your message..."
          className="flex-1 resize-none"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (text.trim()) {
                formRef.current?.requestSubmit();
              }
            }
          }}
        />
        <SubmitButton />
      </form>
    </div>
  );
}
