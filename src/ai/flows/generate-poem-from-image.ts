// Implemented the flow for generating poems from images with multi-language support and tool use for element incorporation.

'use server';

/**
 * @fileOverview Generates a poem inspired by the content of an image.
 *
 * - generatePoemFromImage - A function that generates a poem from an image.
 * - GeneratePoemFromImageInput - The input type for the generatePoemFromImage function.
 * - GeneratePoemFromImageOutput - The return type for the generatePoemFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePoemFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to inspire the poem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language of the poem to be generated.'),
});
export type GeneratePoemFromImageInput = z.infer<typeof GeneratePoemFromImageInputSchema>;

const GeneratePoemFromImageOutputSchema = z.object({
  poem: z.string().describe('The generated poem.'),
});
export type GeneratePoemFromImageOutput = z.infer<typeof GeneratePoemFromImageOutputSchema>;

const getImageElements = ai.defineTool({
  name: 'getImageElements',
  description: 'Identifies key elements present in the image.',
  inputSchema: z.object({
    photoDataUri: z
      .string()
      .describe(
        "A photo to analyze for elements, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  }),
  outputSchema: z.array(z.string()).describe('An array of key elements found in the image.'),
},
async (input) => {
  // Placeholder implementation.  In a real application, this would use an
  // image analysis service to identify elements in the image.
  // For now, return some dummy data.
  return ['tree', 'sun', 'birds'];
});

export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const generatePoemPrompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: GeneratePoemFromImageInputSchema},
  output: {schema: GeneratePoemFromImageOutputSchema},
  tools: [getImageElements],
  prompt: `You are a poet skilled in writing poems in various languages.
  You will be given a photo and a language, and you will write a poem inspired by the photo in the given language.

  If the user specifies that certain elements from the image should be included, use the getImageElements tool to identify those elements.
  Incorporate those identified elements in the poem.

  Language: {{{language}}}
  Photo: {{media url=photoDataUri}}
  `,
});

const generatePoemFromImageFlow = ai.defineFlow(
  {
    name: 'generatePoemFromImageFlow',
    inputSchema: GeneratePoemFromImageInputSchema,
    outputSchema: GeneratePoemFromImageOutputSchema,
  },
  async input => {
    const {output} = await generatePoemPrompt(input);
    return output!;
  }
);
