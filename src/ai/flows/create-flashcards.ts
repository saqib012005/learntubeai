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
  prompt: `You are an expert educator. Your task is to generate flashcards from the given text to help students memorize key information. The flashcards should be in question-answer format.

Text: {{{text}}}

Flashcards:`,
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
