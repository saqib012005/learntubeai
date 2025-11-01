'use server';

import {
  summarizeLecture,
} from '@/ai/flows/summarize-lecture';
import {
  createFlashcards,
} from '@/ai/flows/create-flashcards';
import {
  generateQuiz,
} from '@/ai/flows/generate-quiz';
import {
  timelineHighlights,
} from '@/ai/flows/timeline-highlights';
import {
  explainSimply,
} from '@/ai/flows/explain-simply';
import {
  askDoubt,
} from '@/ai/flows/ai-chat-tutor';
import type { ChatMessage } from '@/lib/types';

export async function generateSummaryAction(text: string) {
  return await summarizeLecture({ text });
}

export async function generateFlashcardsAction(text: string) {
  return await createFlashcards({ text });
}

export async function generateQuizAction(text: string) {
  const result = await generateQuiz({ text });
  return result.quiz;
}

export async function generateTimelineAction(text: string) {
  return await timelineHighlights(text);
}

export async function generateELI5Action(text: string) {
  return await explainSimply({ text });
}

export async function getChatReplyAction(
  history: ChatMessage[],
  message: string,
  transcript: string
) {
  return await askDoubt({ history, message, transcript });
}
