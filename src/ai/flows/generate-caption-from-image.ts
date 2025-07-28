// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates social media captions from an image.
 *
 * - generateCaptionFromImage - A function that generates social media captions from an image.
 * - GenerateCaptionFromImageInput - The input type for the generateCaptionFromImage function.
 * - GenerateCaptionFromImageOutput - The return type for the generateCaptionFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCaptionFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate social media captions from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the captions to be generated in.'),
});
export type GenerateCaptionFromImageInput = z.infer<typeof GenerateCaptionFromImageInputSchema>;

const GenerateCaptionFromImageOutputSchema = z.object({
  instagramCaption: z.string().describe('A caption suitable for Instagram.'),
  facebookCaption: z.string().describe('A caption suitable for Facebook.'),
  twitterCaption: z.string().describe('A caption suitable for Twitter.'),
});
export type GenerateCaptionFromImageOutput = z.infer<typeof GenerateCaptionFromImageOutputSchema>;

export async function generateCaptionFromImage(
  input: GenerateCaptionFromImageInput
): Promise<GenerateCaptionFromImageOutput> {
  return generateCaptionFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCaptionFromImagePrompt',
  input: {schema: GenerateCaptionFromImageInputSchema},
  output: {schema: GenerateCaptionFromImageOutputSchema},
  prompt: `You are a social media expert.  Given the following image, generate captions appropriate for Instagram, Facebook, and Twitter in the following language: {{{language}}}.  Be concise and engaging.\n\nImage: {{media url=photoDataUri}}`,
});

const generateCaptionFromImageFlow = ai.defineFlow(
  {
    name: 'generateCaptionFromImageFlow',
    inputSchema: GenerateCaptionFromImageInputSchema,
    outputSchema: GenerateCaptionFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
