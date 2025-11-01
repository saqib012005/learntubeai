export type Flashcard = {
  question: string;
  answer: string;
};

export type TimelineEvent = {
  timestamp: string;
  highlight: string;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type Feature = 'summary' | 'flashcards' | 'quiz' | 'timeline' | 'explanation';

export type AppStore = {
  // State
  videoUrl: string;
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
  setVideoUrl: (url: string) => void;
  setTranscript: (transcript: string) => void;
  fetchTranscript: (url: string) => Promise<void>;
  generateFeature: (feature: Feature, text?: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
};
