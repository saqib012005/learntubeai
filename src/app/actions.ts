// IMPORTANT: This file is a mock for fetching YouTube transcripts.
// In a real-world application, you would use a library like 'youtube-transcript'
// or a dedicated API to fetch the actual transcript data.
// For demonstration purposes, this file returns a pre-defined sample transcript.

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

const sampleTranscript = `
(0:00) - Welcome to our series on the wonders of the cosmos. Today, we're diving into black holes.
(0:15) - A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape.
(0:35) - This is due to matter being squeezed into a tiny space. This can happen when a star is dying.
(1:05) - There are four main types of black holes: stellar, intermediate, supermassive, and miniature.
(1:30) - Stellar black holes are the most common, formed from the gravitational collapse of a massive star.
(2:00) - Supermassive black holes are found at the center of most galaxies, including our own Milky Way. Sagittarius A* is our galaxy's supermassive black hole.
(2:45) - The edge of a black hole is called the event horizon. It's the point of no return.
(3:15) - Despite their name, black holes are not empty space. They contain a huge amount of matter packed densely.
(3:40) - Studying black holes helps us understand the fundamental laws of physics and the evolution of the universe.
(4:10) - Thank you for joining us. Next time, we'll explore the mysteries of dark matter.
`;

export async function getTranscript(url: string): Promise<string> {
  // Mock fetching logic
  console.log(`Fetching transcript for URL: ${url}`);
  // Basic URL validation
  if (!url || (!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/'))) {
    throw new Error('Invalid YouTube URL provided.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleTranscript);
    }, 1000);
  });
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
