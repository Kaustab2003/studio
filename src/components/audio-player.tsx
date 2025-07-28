'use client';

import { CardContent } from '@/components/ui/card';

type AudioPlayerProps = {
  audioDataUri: string | null;
};

export default function AudioPlayer({ audioDataUri }: AudioPlayerProps) {
  if (!audioDataUri) return null;

  return (
    <CardContent>
      <audio controls autoPlay className="w-full">
        <source src={audioDataUri} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </CardContent>
  );
}
