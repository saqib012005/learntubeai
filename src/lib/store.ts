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
} from '@/lib/types';

export const useAppStore = create<AppStore>((set, get) => ({
  // STATE
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

  sendChatMessage: async (message) => {
    const userMessage: ChatMessage = { role: 'user', content: message };
    set((state) => ({ 
      chatHistory: [...state.chatHistory, userMessage],
      isLoading: { ...state.isLoading, chat: true },
      error: { ...state.error, chat: null }
    }));
    
    try {
      const { transcript, chatHistory } = get();
      if (!transcript) throw new Error('No transcript available for chat.');

      const response = await getChatReplyAction(chatHistory.slice(0, -1), message, transcript);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      set((state) => ({ chatHistory: [...state.chatHistory, assistantMessage] }));

    } catch (e: any) {
      const errorMessage: ChatMessage = { role: 'assistant', content: `Error: ${e.message || 'Failed to get a response.'}` };
      set((state) => ({ chatHistory: [...state.chatHistory, errorMessage] }));
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, chat: false }}));
    }
  },
}));
