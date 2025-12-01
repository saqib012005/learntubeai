'use server';
/**
 * @fileOverview Implements the AI Chat Tutor flow for answering user questions about a given transcript.
 *
 * - askDoubt - An async function that takes chat history and a user message, then returns an AI-generated response.
 * - ChatReplyInput - The input type for the chatReply function, including chat history and the user message.
 */

import {ai} from '@/ai/genkit';
import {DoubtSchema} from '@/lib/types';
import {z} from 'genkit';
import type {Doubt} from '@/lib/types';

const ChatReplyInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .describe('The chat history between the user and the AI.'),
  message: z.string().describe('The current message from the user.'),
  transcript: z.string().describe('The transcript of the YouTube video.'),
  language: z.string().optional().describe('Optional language code or name to reply in, e.g., "en", "es", "fr".'),
});
export type ChatReplyInput = z.infer<typeof ChatReplyInputSchema>;

export async function askDoubt(input: ChatReplyInput): Promise<Doubt> {
  return askDoubtFlow(input);
}

const askDoubtFlow = ai.defineFlow(
  {
    name: 'askDoubtFlow',
    inputSchema: ChatReplyInputSchema,
    outputSchema: DoubtSchema,
  },
  async ({transcript, message, history, language}) => {
      // Log the requested language for debugging (server-side)
      console.log('askDoubtFlow - requested language:', language);

      // Strongly instruct the assistant to reply in the requested language (if provided).
      // Use the language code or name directly (e.g., "en", "hi", "es").
      const languageNote = language
        ? `IMPORTANT: Reply ONLY in the user's requested language (${language}). Do not include an English translation or transliteration. If you are unable to produce a reply in that language, respond briefly in English explaining you cannot comply.`
        : '';

      const prompt = `You are an AI assistant helping a user understand a video transcript. Your goal is to answer their questions, find the most relevant timestamp, and identify the chapter. ${languageNote}

  Analyze the user's question and the provided transcript. Find the most relevant section in the transcript that answers the question.

  Based on that section, provide:
  1. A concise, easy-to-understand answer.
  2. The exact timestamp (e.g., "01:23" or "15:42" or "01:05:33"). Extract it directly. If no specific timestamp is relevant, return null for the timestamp, seconds, and chapter.
  3. The total number of seconds for that timestamp.
  4. The title of the chapter or section containing the answer, if chapters are present in the transcript.

  Here is the chat history:
  {{#each history}}
    {{#if (eq role "user")}}
      User: {{content}}
    {{else}}
      Assistant: {{content}}
    {{/if}}
  {{/each}}

  Transcript:
  """
  ${transcript}
  """

  User's Question: "${message}"`;

    const {output} = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.0-flash',
      output: {
        schema: DoubtSchema,
      },
    });
    return output!;
  }
);
