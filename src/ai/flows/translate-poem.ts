// This file implements the Genkit flow for translating a poem into different languages.

'use server';

/**
 * @fileOverview A poem translation AI agent.
 *
 * - translatePoem - A function that handles the poem translation process.
 * - TranslatePoemInput - The input type for the translatePoem function.
 * - TranslatePoemOutput - The return type for the translatePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TranslatePoemInputSchema = z.object({
  poem: z.string().describe('The poem to translate.'),
  language: z.string().describe('The target language for translation.'),
});
export type TranslatePoemInput = z.infer<typeof TranslatePoemInputSchema>;

const TranslatePoemOutputSchema = z.object({
  translatedPoem: z.string().describe('The translated poem.'),
});
export type TranslatePoemOutput = z.infer<typeof TranslatePoemOutputSchema>;

export async function translatePoem(input: TranslatePoemInput): Promise<TranslatePoemOutput> {
  return translatePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translatePoemPrompt',
  input: {schema: TranslatePoemInputSchema},
  output: {schema: TranslatePoemOutputSchema},
  prompt: `Translate the following poem into {{language}}:\n\n{{{poem}}}`,
});

const translatePoemFlow = ai.defineFlow(
  {
    name: 'translatePoemFlow',
    inputSchema: TranslatePoemInputSchema,
    outputSchema: TranslatePoemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
