'use server';
/**
 * @fileOverview Generates a detailed learning roadmap for a given topic.
 *
 * - generateRoadmap - A function that generates a learning roadmap.
 * - GenerateRoadmapInput - The input type for the generateRoadmap function.
 * - GenerateRoadmapOutput - The return type for the generateRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {RoadmapSchema} from '@/lib/types';
import {z} from 'genkit';
import type {Roadmap} from '@/lib/types';

const GenerateRoadmapInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a learning roadmap.'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<Roadmap> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: {schema: GenerateRoadmapInputSchema},
  output: {schema: RoadmapSchema},
  prompt: `You are an expert curriculum designer and AI assistant. Your task is to generate a comprehensive, structured learning roadmap for the given topic. The roadmap should guide a user from beginner to mastery.

  Topic: {{{topic}}}

  Please adhere to the following guidelines:
  - The tone should be simple, encouraging, and student-friendly.
  - Explain complex concepts as you would to a 10-year-old.
  - All topics must be in a logical, chronological order.
  - For each chapter, suggest relevant YouTube video links, practice tasks, and estimate the time required.
  - Also for each chapter, generate a few flashcards (question and answer) and a few multiple-choice quiz questions.
  - Include ideas for a final project to apply the learned skills.
  - Suggest a revision plan.
  - Provide a list of supplementary resources like books, cheat sheets, and practice websites.

  Generate the output in the specified JSON format.
  `,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: RoadmapSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
