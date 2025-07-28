'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquareQuote } from 'lucide-react';
import type { GenerateCaptionFromImageOutput } from '@/ai/flows/generate-caption-from-image';

type CaptionResultProps = {
  captions: GenerateCaptionFromImageOutput | null;
  isLoading: boolean;
};

export default function CaptionResult({ captions, isLoading }: CaptionResultProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 p-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
    }
    if (captions) {
      return (
        <>
          <TabsContent value="instagram">
            <p className="text-foreground/90 p-4">{captions.instagramCaption}</p>
          </TabsContent>
          <TabsContent value="facebook">
            <p className="text-foreground/90 p-4">{captions.facebookCaption}</p>
          </TabsContent>
          <TabsContent value="twitter">
            <p className="text-foreground/90 p-4">{captions.twitterCaption}</p>
          </TabsContent>
        </>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500 delay-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <MessageSquareQuote className="text-accent" />
          Social Captions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">X / Twitter</TabsTrigger>
          </TabsList>
          {renderContent()}
        </Tabs>
      </CardContent>
    </Card>
  );
}
