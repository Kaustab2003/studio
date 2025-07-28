
'use client';

import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feather, Wand2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-headline tracking-tight">About Photo Poet</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Transforming your visual memories into lyrical masterpieces.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Feather className="h-7 w-7 text-accent" />
                <span className="font-headline text-3xl">What is Photo Poet?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
              <p>
                Photo Poet is an AI-powered creative partner that helps you find the hidden poetry within your photos. Simply upload an image, and our advanced AI will analyze its contents, mood, and essence to generate unique, evocative poems.
              </p>
              <p>
                Whether it's a breathtaking landscape, a cherished family portrait, or a candid street shot, Photo Poet provides you with the words to capture the moment's feeling.
              </p>
            </CardContent>
          </Card>

           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wand2 className="h-7 w-7 text-accent" />
                <span className="font-headline text-3xl">How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
                <ol className="list-decimal list-inside space-y-3">
                    <li>
                        <strong>Upload Your Photo:</strong> Select an image from your device. The magic starts the moment your photo appears.
                    </li>
                    <li>
                        <strong>Customize Your Poem:</strong> Choose a language and poetic style. Our AI automatically detects the photo's mood to set the perfect tone.
                    </li>
                    <li>
                        <strong>Generate & Discover:</strong> With a click of a button, our AI crafts multiple poems for you to explore. You can even translate them into different languages.
                    </li>
                     <li>
                        <strong>Listen & Share:</strong> Bring your poem to life by listening to an audio narration. Share your favorite creations by downloading them as beautiful posters.
                    </li>
                </ol>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-accent" />
                 <span className="font-headline text-3xl">Your Personal Journal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base leading-relaxed">
                <p>
                    By creating a free account, you can save your favorite poems to a personal gallery. Revisit your creations anytime and build a beautiful journal that connects your visual world with the art of poetry.
                </p>
                 <p>
                    Ready to start your poetic journey? <Link href="/" className="font-bold text-accent hover:underline">Begin creating now</Link>.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
