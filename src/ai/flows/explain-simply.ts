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
  prompt: `You are an expert at explaining complex topics in extremely simple, easy-to-understand language. Create a detailed, comprehensive explanation (approximately 2 pages) of the following text. Follow this structure:

1. **What is it?**: Explain the main concept in 2-3 very simple sentences using everyday language.

2. **Analogies**: Use 2-3 real-world analogies or comparisons to help understand the concept. (Example: "Like how a bank stores your money...")

3. **Key Components**: Break down the topic into 5-7 smaller parts and explain each one:
   - Use bullet points
   - Keep each explanation to 2-3 sentences
   - Use simple words, avoid technical jargon
   - Give real examples wherever possible

4. **Why Does It Matter?**: Explain why this concept is important in everyday life (2-3 sentences).

5. **How Does It Work?**: Step-by-step explanation of how the concept works in practice (3-4 sentences or bullet points).

6. **Examples**: Provide 2-3 concrete, relatable examples of this concept in action.

7. **Common Mistakes**: What do people often misunderstand about this topic? (2-3 sentences)

8. **Summary**: Recap the main idea in 1-2 simple sentences.

Make it approximately 2 pages long. Use simple language, plenty of examples, and make it engaging and easy to follow.

Text to explain: {{{text}}}`,
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
