'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting the top 3 priorities from a task list.
 *
 * - suggestTopPriorities - A function that takes a list of tasks and returns the top 3 priorities.
 * - SuggestTopPrioritiesInput - The input type for the suggestTopPriorities function.
 * - SuggestTopPrioritiesOutput - The return type for the suggestTopPriorities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTopPrioritiesInputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('A list of tasks to prioritize.'),
});
export type SuggestTopPrioritiesInput = z.infer<typeof SuggestTopPrioritiesInputSchema>;

const SuggestTopPrioritiesOutputSchema = z.object({
  priorities: z
    .array(z.string())
    .describe('The top 3 prioritized tasks.'),
});
export type SuggestTopPrioritiesOutput = z.infer<typeof SuggestTopPrioritiesOutputSchema>;

export async function suggestTopPriorities(input: SuggestTopPrioritiesInput): Promise<SuggestTopPrioritiesOutput> {
  return suggestTopPrioritiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTopPrioritiesPrompt',
  input: {schema: SuggestTopPrioritiesInputSchema},
  output: {schema: SuggestTopPrioritiesOutputSchema},
  prompt: `Given the following list of tasks, please suggest the top 3 priorities for today. Return only the task names.

Tasks:
{{#each tasks}}- {{this}}\n{{/each}}`,
});

const suggestTopPrioritiesFlow = ai.defineFlow(
  {
    name: 'suggestTopPrioritiesFlow',
    inputSchema: SuggestTopPrioritiesInputSchema,
    outputSchema: SuggestTopPrioritiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
