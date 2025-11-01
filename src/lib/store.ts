import { create } from 'zustand';
import {
  generateSummaryAction,
  generateFlashcardsAction,
  generateQuizAction,
  generateTimelineAction,
  generateELI5Action,
  getChatReplyAction,
} from '@/app/actions';
import type {
  Flashcard,
  TimelineEvent,
  ChatMessage,
  AppStore,
  Feature,
  Doubt,
} from '@/lib/types';

const allFeatures: Feature[] = ['summary', 'explanation', 'flashcards', 'quiz', 'timeline'];

export const useAppStore = create<AppStore>((set, get) => ({
  // STATE
  youtubeUrl: '',
  transcript: '',
  summary: '',
  flashcards: [],
  quiz: '',
  timeline: [],
  explanation: '',
  chatHistory: [],
  isFetchingTranscript: false,
  isLoading: {
    summary: false,
    flashcards: false,
    quiz: false,
    timeline: false,
    explanation: false,
    chat: false,
  },
  error: {
    transcript: null,
    summary: null,
    flashcards: null,
    quiz: null,
    timeline: null,
    explanation: null,
    chat: null,
  },

  // ACTIONS
  setYoutubeUrl: (youtubeUrl) => set({ youtubeUrl }),
  setTranscript: (transcript) => set({ transcript }),

  generateFeature: async (feature, text) => {
    set({ isLoading: { ...get().isLoading, [feature]: true }, error: { ...get().error, [feature]: null } });
    try {
      const transcriptToUse = text || get().transcript;
      if (!transcriptToUse) throw new Error('No transcript available.');

      let result: any;
      switch (feature) {
        case 'summary':
          result = await generateSummaryAction(transcriptToUse);
          set({ summary: result.summary });
          break;
        case 'flashcards':
          result = await generateFlashcardsAction(transcriptToUse);
          set({ flashcards: result.flashcards });
          break;
        case 'quiz':
          result = await generateQuizAction(transcriptToUse);
          set({ quiz: result });
          break;
        case 'timeline':
          result = await generateTimelineAction(transcriptToUse);
          set({ timeline: result });
          break;
        case 'explanation':
          result = await generateELI5Action(transcriptToUse);
          set({ explanation: result.explanation });
          break;
        default:
          throw new Error('Invalid feature');
      }
    } catch (e: any) {
      set({ error: { ...get().error, [feature]: e.message || `Failed to generate ${feature}.` } });
    } finally {
      set({ isLoading: { ...get().isLoading, [feature]: false } });
    }
  },

  generateAllFeatures: async () => {
    const { transcript } = get();
    if (!transcript) return;
    
    // Reset previous outputs
    set({
      summary: '',
      flashcards: [],
      quiz: '',
      timeline: [],
      explanation: '',
      error: {
        transcript: null,
        summary: null,
        flashcards: null,
        quiz: null,
        timeline: null,
        explanation: null,
        chat: null,
      }
    });

    allFeatures.forEach(feature => {
      get().generateFeature(feature);
    });
  },

  sendChatMessage: async (message) => {
    const userMessage: ChatMessage = { role: 'user', content: { answer: message, timestamp: null, seconds: null, chapter: null } };
    set((state) => ({ 
      chatHistory: [...state.chatHistory, userMessage],
      isLoading: { ...state.isLoading, chat: true },
      error: { ...state.error, chat: null }
    }));
    
    try {
      const { transcript, chatHistory } = get();
      if (!transcript) throw new Error('No transcript available for chat.');
      
      const response: Doubt = await getChatReplyAction(
        // We need to simplify the history for the AI
        chatHistory.slice(0, -1).map(h => ({ role: h.role, content: h.content.answer })),
        message, 
        transcript
      );
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      set((state) => ({ chatHistory: [...state.chatHistory, assistantMessage] }));

    } catch (e: any) {
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: {
          answer: `Error: ${e.message || 'Failed to get a response.'}`,
          timestamp: null,
          seconds: null,
          chapter: null,
        }
      };
      set((state) => ({ chatHistory: [...state.chatHistory, errorMessage] }));
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, chat: false }}));
    }
  },
}));
