'use server';

import { profanityFiltering } from '@/ai/flows/profanity-filtering';
import { CURRENT_USER_ID, type Message } from './data';

export async function sendMessage(
  text: string,
  chatId: string,
  chatType: 'room' | 'dm'
): Promise<{ success: boolean; newMessage?: Message; error?: string }> {
  if (!text.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  try {
    const { filteredText, isProfane } = await profanityFiltering({ text });

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: filteredText,
      timestamp: new Date().toISOString(),
      userId: CURRENT_USER_ID,
    };

    if (chatType === 'room') {
      newMessage.roomId = chatId;
    } else {
      newMessage.dmId = chatId;
    }

    // In a real application, you would save the message to a database here.
    // For this scaffold, we just return the new message object.

    return { success: true, newMessage };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
