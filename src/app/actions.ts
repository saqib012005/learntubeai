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
  chatReply,
} from '@/ai/flows/ai-chat-tutor';
import { YoutubeTranscript } from 'youtube-transcript';

export async function getTranscript(url: string): Promise<string> {
  console.log(`Fetching transcript for URL: ${url}`);
  if (!url || (!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/'))) {
    throw new Error('Invalid YouTube URL provided.');
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript found for this video. It might be disabled.');
    }
    // Format the transcript with timestamps.
    return transcript.map(item => `(${(item.offset / 1000).toFixed(2)}) - ${item.text}`).join('\n');
  } catch (error: any) {
    console.error('Error fetching transcript:', error);
    if (error.message.includes('disabled')) {
       throw new Error('Transcript is disabled for this video.');
    }
    if (error.message.includes('No transcript found')) {
      throw new Error('No transcript could be found for this video. Please ensure it has subtitles.');
    }
    throw new Error('Failed to fetch transcript from YouTube.');
  }
}

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
  history: any[],
  message: string,
  transcript: string
) {
  return await chatReply({ history, message, transcript });
}
