// src/ai/flows/explain-simply.ts
'use server';
/**
 * @fileOverview A flow that explains a given text in simple terms (ELI5).
 *
 * - explainSimply - A function that takes text as input and returns a simplified explanation.
 * - ExplainSimplyInput - The input type for the explainSimply function.
 * - ExplainSimplyOutput - The return type for the explainSimply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainSimplyInputSchema = z.object({
  text: z.string().describe('The text to be explained in simple terms.'),
});
export type ExplainSimplyInput = z.infer<typeof ExplainSimplyInputSchema>;

const ExplainSimplyOutputSchema = z.object({
  explanation: z.string().describe('The simplified explanation of the text.'),
});
export type ExplainSimplyOutput = z.infer<typeof ExplainSimplyOutputSchema>;

export async function explainSimply(input: ExplainSimplyInput): Promise<ExplainSimplyOutput> {
  return explainSimplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSimplyPrompt',
  input: {schema: ExplainSimplyInputSchema},
  output: {schema: ExplainSimplyOutputSchema},
  prompt: `Explain the following text in simple terms, as if you were explaining it to a five-year-old (ELI5):

{{{text}}}`,
});

const explainSimplyFlow = ai.defineFlow(
  {
    name: 'explainSimplyFlow',
    inputSchema: ExplainSimplyInputSchema,
    outputSchema: ExplainSimplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
