'use server';
/**
 * @fileOverview A flow for analyzing an image with a text prompt.
 *
 * - analyzeImage - A function that takes an image data URI and a question, returning an AI-generated analysis.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageInputSchema = z.object({
  question: z.string().describe('The user\'s question about the image.'),
  imageDataUri: z
    .string()
    .describe(
      "A frame from a video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question about the image.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageFlow(input);
}

const analyzeImageFlow = ai.defineFlow(
  {
    name: 'analyzeImageFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: [
            {text: `Analyze the following video frame and answer the user's question. Question: ${input.question}`},
            {media: {url: input.imageDataUri}},
        ],
        output: {
            schema: AnalyzeImageOutputSchema,
        },
    });
    return output!;
  }
);
