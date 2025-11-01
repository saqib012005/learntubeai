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

// Roadmap Schemas and Types
export const RoadmapChapterSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  videoLinks: z.array(z.string().url()),
  practiceTasks: z.array(z.string()),
  flashcards: z.array(z.object({ question: z.string(), answer: z.string() })),
  quizQuestions: z.array(z.object({ question: z.string(), options: z.array(z.string()), answer: z.string() })),
  timeRequired: z.string().describe("e.g., '2 weeks'"),
});

export const RoadmapLevelSchema = z.object({
  stage: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Beginner / Intermediate', 'Intermediate / Advanced']),
  chapters: z.array(RoadmapChapterSchema),
});

export const RoadmapResourcesSchema = z.object({
  books: z.array(z.string()),
  cheatSheets: z.array(z.string().url()),
  practiceSites: z.array(z.string().url()),
});

export const RoadmapSchema = z.object({
  topic: z.string(),
  levels: z.array(RoadmapLevelSchema),
  finalProjectIdeas: z.array(z.string()),
  revisionPlan: z.string(),
  resources: RoadmapResourcesSchema,
});

export type RoadmapChapter = z.infer<typeof RoadmapChapterSchema>;
export type RoadmapLevel = z.infer<typeof RoadmapLevelSchema>;
export type RoadmapResources = z.infer<typeof RoadmapResourcesSchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;


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
  roadmapTopic: string;
  roadmap: Roadmap | null;
  capturedFrame: string | null;
  imageAnalysisQuestion: string;
  imageAnalysisAnswer: string;
  isFetchingTranscript: boolean;
  isLoading: { [key in Feature | 'chat' | 'roadmap' | 'imageAnalysis']: boolean };
  error: { [key in Feature | 'transcript' | 'chat' | 'roadmap' | 'imageAnalysis']: string | null };

  // Actions
  setYoutubeUrl: (url: string) => void;
  setTranscript: (transcript: string) => void;
  generateFeature: (feature: Feature, text?: string) => Promise<void>;
  generateAllFeatures: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  setRoadmapTopic: (topic: string) => void;
  generateRoadmap: (topic: string) => Promise<void>;
  setCapturedFrame: (frame: string | null) => void;
  setImageAnalysisQuestion: (question: string) => void;
  analyzeFrame: () => Promise<void>;
};
