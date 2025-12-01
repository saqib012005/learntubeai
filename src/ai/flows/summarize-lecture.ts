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
  prompt: `You are an expert educator. Create a comprehensive, detailed summary (approximately 1 page) of the following lecture transcript. Structure your summary as follows:

1. **Overview**: Start with 2-3 sentences explaining what the lecture is about.

2. **Key Concepts**: List and explain 5-8 main concepts or topics covered, each in 2-3 sentences using simple, easy-to-understand language.

3. **Main Points**: Provide 8-10 bullet points summarizing the most important takeaways.

4. **Practical Applications**: Explain how these concepts can be applied in real life or why they matter (2-3 sentences).

5. **Conclusion**: Summarize the overall message of the lecture in 2-3 sentences.

Use simple language, avoid jargon, and make it engaging. Aim for approximately 1 full page of detailed, well-organized content.

Transcript: {{{text}}}`,
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
