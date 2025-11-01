'use server';
/**
 * @fileOverview Implements the AI Chat Tutor flow for answering user questions about a given transcript.
 *
 * - chatReply - An async function that takes chat history and a user message, then returns an AI-generated response.
 * - ChatReplyInput - The input type for the chatReply function, including chat history and the user message.
 * - ChatReplyOutput - The output type for the chatReply function, which is a string containing the AI's reply.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatReplyInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).describe('The chat history between the user and the AI.'),
  message: z.string().describe('The current message from the user.'),
  transcript: z.string().describe('The transcript of the YouTube video.'),
});
export type ChatReplyInput = z.infer<typeof ChatReplyInputSchema>;

const ChatReplyOutputSchema = z.string().describe('The AI-generated reply to the user message.');
export type ChatReplyOutput = z.infer<typeof ChatReplyOutputSchema>;

export async function chatReply(input: ChatReplyInput): Promise<ChatReplyOutput> {
  return chatReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatReplyPrompt',
  input: {schema: ChatReplyInputSchema},
  output: {schema: ChatReplyOutputSchema},
  prompt: `You are a helpful AI tutor answering questions about a YouTube video transcript.
  The transcript is as follows:
  {{transcript}}

  Here is the chat history:
  {{#each history}}
  {{#if (eq role \"user\")}}
  User: {{content}}
  {{else}}
  Assistant: {{content}}
  {{/if}}
  {{/each}}

  Now, respond to the following message from the user:
  User: {{message}}
  `,
});

const chatReplyFlow = ai.defineFlow(
  {
    name: 'chatReplyFlow',
    inputSchema: ChatReplyInputSchema,
    outputSchema: ChatReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

