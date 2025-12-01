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

const QuestionSchema = z.object({
  type: z.enum(['multiple-choice', 'short-answer', 'true-false']).describe('Type of question'),
  question: z.string().describe('The quiz question'),
  options: z.array(z.string()).optional().describe('Options for multiple-choice questions (A, B, C, D)'),
  correctAnswer: z.string().describe('The correct answer or answer key'),
  explanation: z.string().describe('Explanation of why this is the correct answer'),
});

const GenerateQuizOutputSchema = z.object({
  quiz: z
    .array(QuestionSchema)
    .describe('An array of quiz questions with answers and explanations'),
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
  prompt: `You are a professional assessment designer specializing in creating effective quizzes that test deep understanding and knowledge retention.

QUIZ CREATION GUIDELINES:

1. QUESTION DISTRIBUTION:
   - 40% Multiple-Choice Questions (4 options each, only 1 correct)
   - 40% Short-Answer Questions (open-ended, test application & analysis)
   - 20% True/False Questions

2. DIFFICULTY PROGRESSION:
   - Questions 1-3: Easy (basic concepts, definitions)
   - Questions 4-7: Medium (relationships, applications)
   - Questions 8-10: Hard (analysis, synthesis, critical thinking)

3. MULTIPLE-CHOICE GUIDELINES:
   - Exactly 4 options (A, B, C, D)
   - One clearly correct answer
   - Distractors should be plausible but incorrect
   - Avoid trick questions or ambiguous wording
   - Use realistic, contextual scenarios when possible

4. SHORT-ANSWER GUIDELINES:
   - Ask students to "Explain", "Analyze", "Compare", "Describe", "Evaluate"
   - Questions should require 2-3 sentences of explanation
   - Correct answer should include key terms and concepts

5. TRUE/FALSE GUIDELINES:
   - Statements should be clearly true or false, not ambiguous
   - Include specific facts from the text
   - Mix true and false answers

6. GENERAL REQUIREMENTS:
   - Generate 10 questions total
   - Questions must be directly based on the provided text
   - Avoid questions outside the scope of the material
   - Each question should test a different concept or skill
   - Provide clear, concise explanations for correct answers
   - Use clear, professional language

TEXT FOR QUIZ GENERATION:
{{{text}}}

Create a comprehensive 10-question quiz following all guidelines above.`,
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
