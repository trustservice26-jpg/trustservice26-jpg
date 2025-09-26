'use server';

import { profanityFiltering } from '@/ai/flows/profanity-filtering';
import { CURRENT_USER_ID, type Message } from './data';
import { createMessage } from './firestore';

export async function sendMessage(
  text: string,
  chatId: string,
  chatType: 'room' | 'dm'
): Promise<{ success: boolean; newMessage?: Message; error?: string }> {
  if (!text.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  try {
    const { filteredText } = await profanityFiltering({ text });

    const newMessage = await createMessage(filteredText, chatId, chatType, CURRENT_USER_ID);

    return { success: true, newMessage };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'An unexpected error occurred while sending the message.' };
  }
}
