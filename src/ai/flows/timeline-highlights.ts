'use server';
/**
 * @fileOverview Generates a timeline of key moments from a transcript.
 *
 * - timelineHighlights - A function that generates a timeline of key moments from a transcript.
 * - TimelineHighlightsInput - The input type for the timelineHighlights function.
 * - TimelineHighlightsOutput - The return type for the timelineHighlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimelineHighlightsInputSchema = z.string().describe('The transcript of the video.');
export type TimelineHighlightsInput = z.infer<typeof TimelineHighlightsInputSchema>;

const TimelineHighlightsOutputSchema = z.array(
  z.object({
    timestamp: z.string().describe('The timestamp of the key moment.'),
    highlight: z.string().describe('The description of the key moment.'),
  })
);
export type TimelineHighlightsOutput = z.infer<typeof TimelineHighlightsOutputSchema>;

export async function timelineHighlights(text: TimelineHighlightsInput): Promise<TimelineHighlightsOutput> {
  return timelineHighlightsFlow(text);
}

const timelineHighlightsPrompt = ai.definePrompt({
  name: 'timelineHighlightsPrompt',
  input: {schema: TimelineHighlightsInputSchema},
  output: {schema: TimelineHighlightsOutputSchema},
  prompt: `You are an expert at identifying key moments in a video transcript and generating a timeline.

  Given the following transcript, identify the key moments and generate a timeline with timestamps and descriptions.

  Transcript: {{{input}}}

  Return the timeline in the following JSON format:
  `,
});

const timelineHighlightsFlow = ai.defineFlow(
  {
    name: 'timelineHighlightsFlow',
    inputSchema: TimelineHighlightsInputSchema,
    outputSchema: TimelineHighlightsOutputSchema,
  },
  async text => {
    const {output} = await timelineHighlightsPrompt(text);
    return output!;
  }
);
