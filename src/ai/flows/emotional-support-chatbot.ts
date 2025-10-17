// src/ai/flows/emotional-support-chatbot.ts
'use server';

/**
 * @fileOverview An AI-powered virtual counselor chatbot for providing emotional support in Arabic.
 *
 * - aiCounselor - A function that handles the chatbot interaction.
 * - AICounselorInput - The input type for the aiCounselor function.
 * - AICounselorOutput - The return type for the aiCounselor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICounselorInputSchema = z.object({
  message: z.string().describe('The user message in Arabic.'),
});
export type AICounselorInput = z.infer<typeof AICounselorInputSchema>;

const AICounselorOutputSchema = z.object({
  response: z.string().describe('The AI counselor response in Arabic.'),
});
export type AICounselorOutput = z.infer<typeof AICounselorOutputSchema>;

export async function aiCounselor(input: AICounselorInput): Promise<AICounselorOutput> {
  return aiCounselorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCounselorPrompt',
  input: {schema: AICounselorInputSchema},
  output: {schema: AICounselorOutputSchema},
  prompt: `You are a compassionate and supportive AI counselor specializing in emotional well-being. Respond to the user's message in Arabic, providing helpful and encouraging guidance. Always respond in Arabic.

User message: {{{message}}}`,
});

const aiCounselorFlow = ai.defineFlow(
  {
    name: 'aiCounselorFlow',
    inputSchema: AICounselorInputSchema,
    outputSchema: AICounselorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
