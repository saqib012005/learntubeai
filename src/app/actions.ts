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
import { generateRoadmap } from '@/ai/flows/generate-roadmap';
import { analyzeImage } from '@/ai/flows/analyze-image';
import type { Roadmap, Doubt, TimelineEvent } from '@/lib/types';

export async function generateSummaryAction(text: string): Promise<{ summary: string }> {
  return await summarizeLecture({ text });
}

export async function generateFlashcardsAction(text: string) {
  return await createFlashcards({ text });
}

export async function generateQuizAction(text: string): Promise<string> {
  const result = await generateQuiz({ text });
  return result.quiz;
}

export async function generateTimelineAction(text: string): Promise<TimelineEvent[]> {
  return await timelineHighlights(text);
}

export async function generateELI5Action(text: string): Promise<{ explanation: string }> {
  return await explainSimply({ text });
}

export async function getChatReplyAction(
  history: {role: 'user' | 'assistant', content: string}[],
  message: string,
  transcript: string
): Promise<Doubt> {
  return await askDoubt({ history, message, transcript });
}

export async function generateRoadmapAction(topic: string): Promise<Roadmap> {
    return await generateRoadmap({ topic });
}

export async function analyzeImageAction(question: string, imageDataUri: string) {
  const result = await analyzeImage({ question, imageDataUri });
  return result.answer;
}
