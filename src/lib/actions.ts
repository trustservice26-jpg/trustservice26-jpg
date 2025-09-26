'use server';

import { profanityFiltering } from '@/ai/flows/profanity-filtering';
import { type Message } from './data';
import { createMessage } from './firestore';

export async function sendMessage(
  text: string,
  userId: string,
): Promise<{ success: boolean; newMessage?: Message; error?: string }> {
  if (!text.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }
   if (!userId) {
    return { success: false, error: 'User ID is missing.' };
  }

  try {
    const { filteredText } = await profanityFiltering({ text });

    const newMessage = await createMessage(filteredText, userId);

    return { success: true, newMessage };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'An unexpected error occurred while sending the message.' };
  }
}
