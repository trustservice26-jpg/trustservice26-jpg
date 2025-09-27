'use server';

import { profanityFiltering } from '@/ai/flows/profanity-filtering';
import { type Message } from './data';
import { createMessage } from './firestore';

export async function sendMessage(
  text: string,
  userId: string,
  chatId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!text.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }
   if (!userId) {
    return { success: false, error: 'User ID is missing.' };
  }
   if (!chatId) {
    return { success: false, error: 'Chat ID is missing.' };
   }

  try {
    const { filteredText } = await profanityFiltering({ text });

    await createMessage(filteredText, userId, chatId);

    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred while sending the message.' };
  }
}
