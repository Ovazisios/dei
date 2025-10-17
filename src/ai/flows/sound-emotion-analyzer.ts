
'use server';
/**
 * @fileOverview An AI agent that analyzes the results of the "Sound and Feelings Box" game.
 *
 * - soundEmotionAnalyzer - A function that provides feedback on the game performance.
 * - SoundEmotionAnalyzerInput - The input type for the soundEmotionAnalyzer function.
 * - SoundEmotionAnalyzerOutput - The return type for the soundEmotionAnalyzer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoundEmotionAnalyzerInputSchema = z.object({
  score: z.number().describe('The number of correct answers.'),
  totalRounds: z.number().describe('The total number of rounds in the game.'),
});
export type SoundEmotionAnalyzerInput = z.infer<typeof SoundEmotionAnalyzerInputSchema>;

const SoundEmotionAnalyzerOutputSchema = z.object({
  report: z.string().describe('A friendly and encouraging report in Arabic for the child and parent based on the score.'),
});
export type SoundEmotionAnalyzerOutput = z.infer<typeof SoundEmotionAnalyzerOutputSchema>;

export async function soundEmotionAnalyzer(input: SoundEmotionAnalyzerInput): Promise<SoundEmotionAnalyzerOutput> {
  return soundEmotionAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soundEmotionAnalyzerPrompt',
  input: {schema: SoundEmotionAnalyzerInputSchema},
  output: {schema: SoundEmotionAnalyzerOutputSchema},
  prompt: `You are a friendly and encouraging AI assistant for a 5-year-old child who just completed an emotion-sound matching game.
The child's score is {{{score}}} out of {{{totalRounds}}}.

Generate a short, positive, and simple report in Arabic.
- Start by congratulating the child, regardless of the score.
- Briefly comment on their performance in a positive way.
- If the score is low, add a very simple tip for the parent/educator.
- Keep the language simple, warm, and encouraging.

Example for a high score:
"عمل رائع يا بطل! لقد كنت مدهشًا في معرفة المشاعر من الأصوات. استمر في اللعب والتعلم!"

Example for a lower score:
"أحسنت المحاولة! أنت تتعلم بسرعة كبيرة. نصيحة صغيرة للمربي: يمكنكم التدرب على أصوات الحيوانات في المنزل وربطها بمشاعر مختلفة."
`,
});

const soundEmotionAnalyzerFlow = ai.defineFlow(
  {
    name: 'soundEmotionAnalyzerFlow',
    inputSchema: SoundEmotionAnalyzerInputSchema,
    outputSchema: SoundEmotionAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
