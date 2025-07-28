'use server';
/**
 * @fileOverview Converts a poem's text into narrated audio.
 *
 * - narratePoem - A function that handles the text-to-speech process.
 * - NarratePoemOutput - The return type for the narratePoem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const NarratePoemOutputSchema = z.object({
  media: z.string().describe("The narrated poem as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'"),
});
export type NarratePoemOutput = z.infer<typeof NarratePoemOutputSchema>;

export async function narratePoem(poem: string): Promise<NarratePoemOutput> {
  return narratePoemFlow(poem);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const narratePoemFlow = ai.defineFlow(
  {
    name: 'narratePoemFlow',
    inputSchema: z.string(),
    outputSchema: NarratePoemOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
