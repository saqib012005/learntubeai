'use server';

/**
 * @fileOverview Generates flashcards from a given text.
 *
 * - createFlashcards - A function that generates flashcards from the input text.
 * - CreateFlashcardsInput - The input type for the createFlashcards function.
 * - CreateFlashcardsOutput - The return type for the createFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateFlashcardsInputSchema = z.object({
  text: z.string().describe('The text to generate flashcards from.'),
});
export type CreateFlashcardsInput = z.infer<typeof CreateFlashcardsInputSchema>;

const CreateFlashcardsOutputSchema = z.object({
  flashcards: z
    .array(z.object({
      question: z.string().describe('The question for the flashcard.'),
      answer: z.string().describe('The answer to the question.'),
    }))
    .describe('An array of flashcards generated from the text.'),
});
export type CreateFlashcardsOutput = z.infer<typeof CreateFlashcardsOutputSchema>;

export async function createFlashcards(input: CreateFlashcardsInput): Promise<CreateFlashcardsOutput> {
  return createFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createFlashcardsPrompt',
  input: {schema: CreateFlashcardsInputSchema},
  output: {schema: CreateFlashcardsOutputSchema},
  prompt: `You are an expert educational content creator specializing in creating effective study materials. Your task is to generate high-quality flashcards from the provided text.

REQUIREMENTS:
1. Create 15-20 flashcards covering the most important concepts and facts
2. Questions should test understanding, not just memorization
3. Answers should be concise (1-3 sentences), clear, and accurate
4. Use progressively harder questions (start with basic concepts, move to advanced)
5. Include both definitional and application-based questions
6. Avoid overly complex or ambiguous questions
7. Ensure each Q&A pair is self-contained and meaningful

GUIDELINES FOR QUESTIONS:
- Use various question types: "What is...", "How does...", "Why...", "Explain...", "What are the key..."
- Make questions specific and clear, not vague
- Avoid yes/no questions; use open-ended format

GUIDELINES FOR ANSWERS:
- Start directly with the answer (no "The answer is...")
- Use simple, clear language
- Include key terms and definitions where applicable
- Be comprehensive but concise (1-3 sentences max)
- Provide context when needed

TEXT TO EXTRACT FLASHCARDS FROM:
{{{text}}}

Generate 15-20 high-quality flashcards in the format specified above.`,
});

const createFlashcardsFlow = ai.defineFlow(
  {
    name: 'createFlashcardsFlow',
    inputSchema: CreateFlashcardsInputSchema,
    outputSchema: CreateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
