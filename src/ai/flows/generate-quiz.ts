// src/ai/flows/generate-quiz.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a quiz from a given text transcript.
 *
 * The flow uses the gemini-2.0-flash model to create multiple-choice and short answer questions based on the transcript content.
 *
 * @exports {generateQuiz} - An async function to generate a quiz from the provided text.
 * @exports {GenerateQuizInput} - The input type for the generateQuiz function.
 * @exports {GenerateQuizOutput} - The output type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  text: z.string().describe('The transcript text to generate a quiz from.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z
    .string()
    .describe(
      'A quiz generated from the transcript, including multiple-choice and short answer questions.'
    ),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

/**
 * Generates a quiz from the provided text transcript.
 * @param {GenerateQuizInput} input - The input object containing the transcript text.
 * @returns {Promise<GenerateQuizOutput>} - A promise that resolves with the generated quiz.
 */
export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an AI quiz generator. Generate a quiz with multiple-choice and short answer questions based on the following transcript. Make sure the questions test understanding of the key concepts. Return the quiz as a string.

Transcript:
{{text}}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await generateQuizPrompt(input);
    return output!;
  }
);
