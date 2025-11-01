import { z } from 'zod';

export type Flashcard = {
  question: string;
  answer: string;
};

export type TimelineEvent = {
  timestamp: string;
  highlight: string;
};

export const DoubtSchema = z.object({
  answer: z.string().describe('A friendly explanation of the answer in simple language.'),
  timestamp: z
    .string()
    .nullable()
    .describe('The most relevant timestamp from the transcript, in MM:SS or HH:MM:SS format.'),
  seconds: z.number().nullable().describe('The timestamp in total seconds.'),
  chapter: z.string().nullable().describe('The chapter title where the answer is found.'),
});

export type Doubt = z.infer<typeof DoubtSchema>;

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: Doubt;
};

export type Feature = 'summary' | 'flashcards' | 'quiz' | 'timeline' | 'explanation';

export type AppStore = {
  // State
  youtubeUrl: string;
  transcript: string;
  summary: string;
  flashcards: Flashcard[];
  quiz: string;
  timeline: TimelineEvent[];
  explanation: string;
  chatHistory: ChatMessage[];
  isFetchingTranscript: boolean;
  isLoading: { [key in Feature | 'chat']: boolean };
  error: { [key in Feature | 'transcript' | 'chat']: string | null };

  // Actions
  setYoutubeUrl: (url: string) => void;
  setTranscript: (transcript: string) => void;
  generateFeature: (feature: Feature, text?: string) => Promise<void>;
  generateAllFeatures: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
};
