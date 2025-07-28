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
import {z} from 'zod';
import {googleAI} from '@genkit-ai/googleai';

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
  poems: z.array(z.string()).describe('An array of three generated poems.'),
  detectedTone: z.string().describe('The mood or tone detected from the image.'),
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
  // In a real application, this would use an image analysis service.
  // For now, we'll use a prompt to have the LLM identify the elements.
  const identifyPrompt = ai.definePrompt({
    name: 'identifyImageElements',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: z.object({ elements: z.array(z.string()) }) },
    prompt: `Analyze the following image and list up to 5 key elements you see.
    Image: {{media url=photoDataUri}}`
  });
  
  const { output } = await identifyPrompt({photoDataUri: input.photoDataUri});
  return output?.elements || [];
});

export async function generatePoemFromImage(input: GeneratePoemFromImageInput): Promise<GeneratePoemFromImageOutput> {
  return generatePoemFromImageFlow(input);
}

const generatePoemPrompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: {schema: z.object({
    photoDataUri: z.string(),
    language: z.string(),
    detectedTone: z.string(),
  })},
  output: {schema: GeneratePoemFromImageOutputSchema},
  tools: [getImageElements],
  model: googleAI.model('gemini-2.0-flash'),
  prompt: `You are a world-class poet. Analyze the image and its mood, which is '{{{detectedTone}}}'. Write three distinct poems in {{{language}}} inspired by the image.
Use the getImageElements tool if you need to identify specific objects to incorporate into your poems.
Return your three poems and the original detected tone.
Photo: {{media url=photoDataUri}}
  `,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
        },
    ],
    timeout: 30000,
  }
});

const detectMoodPrompt = ai.definePrompt({
    name: 'detectMoodPrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: { schema: z.object({ mood: z.string().describe('A single word describing the mood, e.g., "Romantic", "Melancholic", "Joyful".') }) },
    prompt: `Analyze the following image and determine its overall mood or emotional tone. Respond with a single, descriptive word.
      Image: {{media url=photoDataUri}}`
});

const generatePoemFromImageFlow = ai.defineFlow(
  {
    name: 'generatePoemFromImageFlow',
    inputSchema: GeneratePoemFromImageInputSchema,
    outputSchema: GeneratePoemFromImageOutputSchema,
  },
  async input => {
    // First, detect the mood from the image.
    const moodResponse = await detectMoodPrompt({ photoDataUri: input.photoDataUri });
    const detectedTone = moodResponse.output?.mood || 'Reflective'; // Default to 'Reflective' if detection fails

    // Then, generate the poem with the detected mood.
    const { output } = await generatePoemPrompt({
      ...input,
      detectedTone: detectedTone,
    });
    
    // Ensure the output includes the detected tone, even if the prompt somehow fails to.
    return {
      poems: output?.poems || [],
      detectedTone: output?.detectedTone || detectedTone,
    };
  }
);
