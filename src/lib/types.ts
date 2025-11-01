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
