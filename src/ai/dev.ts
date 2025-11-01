import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-lecture.ts';
import '@/ai/flows/create-flashcards.ts';
import '@/ai/flows/ai-chat-tutor.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/timeline-highlights.ts';
import '@/ai/flows/explain-simply.ts';
