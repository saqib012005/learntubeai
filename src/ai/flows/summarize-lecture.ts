'use server';

/**
 * @fileOverview Summarizes a lecture transcript to provide a concise overview of the video's main points.
 *
 * - summarizeLecture - A function that takes a lecture transcript as input and returns a summary.
 * - SummarizeLectureInput - The input type for the summarizeLecture function.
 * - SummarizeLectureOutput - The return type for the summarizeLecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLectureInputSchema = z.object({
  text: z.string().describe('The lecture transcript to summarize.'),
});
export type SummarizeLectureInput = z.infer<typeof SummarizeLectureInputSchema>;

const SummarizeLectureOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the lecture transcript.'),
});
export type SummarizeLectureOutput = z.infer<typeof SummarizeLectureOutputSchema>;

export async function summarizeLecture(input: SummarizeLectureInput): Promise<SummarizeLectureOutput> {
  return summarizeLectureFlow(input);
}

const summarizeLecturePrompt = ai.definePrompt({
  name: 'summarizeLecturePrompt',
  input: {schema: SummarizeLectureInputSchema},
  output: {schema: SummarizeLectureOutputSchema},
  prompt: `Summarize the following lecture transcript, providing a concise overview of the video's main points. Aim for a summary that captures the essence of the lecture in a clear and understandable manner.\n\nTranscript: {{{text}}}`,
});

const summarizeLectureFlow = ai.defineFlow(
  {
    name: 'summarizeLectureFlow',
    inputSchema: SummarizeLectureInputSchema,
    outputSchema: SummarizeLectureOutputSchema,
  },
  async input => {
    const {output} = await summarizeLecturePrompt(input);
    return output!;
  }
);
