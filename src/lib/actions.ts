'use server';

import { profanityFiltering } from '@/ai/flows/profanity-filtering';
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

  let filteredText = text;
  // Only run profanity filter if the API key is likely set.
  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await profanityFiltering({ text });
      filteredText = result.filteredText;
    } catch (error) {
      console.error('Profanity filter failed, sending original text:', error);
      // If the filter fails for any reason, we will just send the original text.
      // We don't want to block the user from chatting.
    }
  }

  try {
    await createMessage(filteredText, userId, chatId);
    return { success: true };
  } catch (error) {
    console.error('Error sending message to Firestore:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to save message to database: ${errorMessage}` };
  }
}
