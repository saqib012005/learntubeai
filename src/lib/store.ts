import { create } from 'zustand';
import {
  generateSummaryAction,
  generateFlashcardsAction,
  generateQuizAction,
  generateTimelineAction,
  generateELI5Action,
  getChatReplyAction,
  generateRoadmapAction,
} from '@/app/actions';
import type {
  Flashcard,
  TimelineEvent,
  ChatMessage,
  AppStore,
  Feature,
  Doubt,
  Roadmap,
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
  roadmapTopic: '',
  roadmap: null,
  isFetchingTranscript: false,
  isLoading: {
    summary: false,
    flashcards: false,
    quiz: false,
    timeline: false,
    explanation: false,
    chat: false,
    roadmap: false,
  },
  error: {
    transcript: null,
    summary: null,
    flashcards: null,
    quiz: null,
    timeline: null,
    explanation: null,
    chat: null,
    roadmap: null,
  },

  // ACTIONS
  setYoutubeUrl: (youtubeUrl) => set({ youtubeUrl }),
  setTranscript: (transcript) => set({ transcript }),
  setRoadmapTopic: (topic) => set({ roadmapTopic: topic }),

  generateFeature: async (feature, text) => {
    set((state) => ({ 
      isLoading: { ...state.isLoading, [feature]: true }, 
      error: { ...state.error, [feature]: null } 
    }));
    try {
      const transcriptToUse = text || get().transcript;
      if (!transcriptToUse) throw new Error('No transcript available.');

      switch (feature) {
        case 'summary': {
          const result = await generateSummaryAction(transcriptToUse);
          set({ summary: result.summary });
          break;
        }
        case 'flashcards': {
          const result = await generateFlashcardsAction(transcriptToUse);
          set({ flashcards: result.flashcards });
          break;
        }
        case 'quiz': {
          const result = await generateQuizAction(transcriptToUse);
          set({ quiz: result });
          break;
        }
        case 'timeline': {
          const result = await generateTimelineAction(transcriptToUse);
          set({ timeline: result });
          break;
        }
        case 'explanation': {
          const result = await generateELI5Action(transcriptToUse);
          set({ explanation: result.explanation });
          break;
        }
        default:
          // This should not be reached if 'feature' is of type Feature
          const exhaustiveCheck: never = feature;
          throw new Error(`Invalid feature: ${exhaustiveCheck}`);
      }
    } catch (e: any) {
      set((state) => ({ error: { ...state.error, [feature]: e.message || `Failed to generate ${feature}.` } }));
    } finally {
      set((state) => ({ isLoading: { ...state.isLoading, [feature]: false } }));
    }
  },

  generateAllFeatures: async () => {
    const { transcript } = get();
    if (!transcript) return;
    
    // Reset previous outputs
    set((state) => ({
      summary: '',
      flashcards: [],
      quiz: '',
      timeline: [],
      explanation: '',
      error: {
        ...state.error,
        summary: null,
        flashcards: null,
        quiz: null,
        timeline: null,
        explanation: null,
        chat: null,
      }
    }));

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

  generateRoadmap: async (topic) => {
    set({
      isLoading: { ...get().isLoading, roadmap: true },
      error: { ...get().error, roadmap: null },
      roadmap: null,
    });
    try {
      const roadmapData = await generateRoadmapAction(topic);
      set({ roadmap: roadmapData });
    } catch (e: any) {
      set({ error: { ...get().error, roadmap: e.message || 'Failed to generate roadmap.' } });
    } finally {
      set({ isLoading: { ...get().isLoading, roadmap: false } });
    }
  },
}));
