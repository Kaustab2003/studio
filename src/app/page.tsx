
'use client';

import { useState } from 'react';
import { generatePoemFromImage } from '@/ai/flows/generate-poem-from-image';
import { generateCaptionFromImage } from '@/ai/flows/generate-caption-from-image';
import { narratePoem } from '@/ai/flows/narrate-poem';
import { translatePoem } from '@/ai/flows/translate-poem';
import type { GenerateCaptionFromImageOutput } from '@/ai/flows/generate-caption-from-image';
import PhotoUploader from '@/components/photo-uploader';
import PoemResult from '@/components/poem-result';
import CaptionResult from '@/components/caption-result';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function PhotoPoetPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [poems, setPoems] = useState<string[] | null>(null);
  const [detectedTone, setDetectedTone] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<string | null>(null);
  const [translatedPoem, setTranslatedPoem] = useState<string | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [captions, setCaptions] = useState<GenerateCaptionFromImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState('Free Verse');
  
  const resetResults = () => {
    setPoems(null);
    setSelectedPoem(null);
    setCaptions(null);
    setAudioDataUri(null);
    setDetectedTone(null);
    setTranslatedPoem(null);
  }
  
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      resetResults();
    };
    reader.readAsDataURL(file);
  };

  const handleNarration = async () => {
    const poemToNarrate = translatedPoem || selectedPoem;
    if (!poemToNarrate) return;

    setIsNarrating(true);
    try {
      const response = await narratePoem(poemToNarrate);
      if (response.media) {
        setAudioDataUri(response.media);
      } else {
        toast({
          variant: "destructive",
          title: "Narration Failed",
          description: "Could not generate audio for the poem. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Failed to narrate poem:", error);
      toast({
        variant: "destructive",
        title: "Narration Error",
        description: "An unexpected error occurred while generating audio. Please check your connection and try again.",
      });
    } finally {
      setIsNarrating(false);
    }
  };

  const handleTranslation = async () => {
    if(!selectedPoem) return;
    setIsTranslating(true);
    setAudioDataUri(null);
    try {
        const response = await translatePoem({ poem: selectedPoem, language });
        setTranslatedPoem(response.translatedPoem);
        toast({
            title: "Poem Translated!",
            description: `The poem has been translated to ${language}. You can now listen to the new version.`,
        });
    } catch(error) {
        console.error("Failed to translate poem:", error);
        toast({
            variant: "destructive",
            title: "Translation Error",
            description: "An unexpected error occurred during translation. Please check the language and try again.",
        });
    } finally {
        setIsTranslating(false);
    }
  };

  const handleSaveToJournal = async () => {
    const poemToSave = translatedPoem || selectedPoem;
    if (!user) {
        toast({
            variant: "destructive",
            title: "Sign In Required",
            description: "Please sign in or create an account to save poems to your journal.",
        });
        return;
    }
     if (!poemToSave || !imagePreview || !detectedTone) {
        toast({
            variant: "destructive",
            title: "Cannot Save",
            description: "A poem, image, and detected tone must be present to save.",
        });
        return;
    }
    setIsSaving(true);
    try {
        // 1. Upload image to Firebase Storage
        const imageRef = ref(storage, `poems/${user.uid}/${uuidv4()}`);
        const uploadResult = await uploadString(imageRef, imagePreview, 'data_url');
        const imageUrl = await getDownloadURL(uploadResult.ref);

        // 2. Save poem data to Firestore
        await addDoc(collection(db, "poems"), {
            userId: user.uid,
            poem: poemToSave,
            imageUrl: imageUrl,
            language: language,
            style: style,
            tone: detectedTone,
            createdAt: serverTimestamp(),
        });

        toast({
            title: "Poem Saved!",
            description: "Your poem has been successfully saved to your personal journal.",
        });
    } catch (error) {
        console.error("Error saving poem:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "An unexpected error occurred while saving your poem. Please try again later.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      toast({
        variant: "destructive",
        title: "No Photo Selected",
        description: "Please upload a photo to generate a poem.",
      });
      return;
    }
    setIsLoading(true);
    resetResults();
    
    try {
      const languagePrompt = `${language} in a ${style} style`;
      
      const [poemResponse, captionResponse] = await Promise.all([
        generatePoemFromImage({ photoDataUri: imagePreview, language: languagePrompt }),
        generateCaptionFromImage({ photoDataUri: imagePreview, language: language }),
      ]);

      if (poemResponse.poems && poemResponse.poems.length > 0) {
        setPoems(poemResponse.poems);
        setSelectedPoem(poemResponse.poems[0]);
        setDetectedTone(poemResponse.detectedTone);
      } else {
        throw new Error("Poem generation returned no results.");
      }
      
      setCaptions(captionResponse);

    } catch (error) {
      console.error("Failed to generate content:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "The AI failed to generate content for your image. This can happen with certain images. Please try a different photo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePoemSelection = (poem: string) => {
    setSelectedPoem(poem);
    setAudioDataUri(null);
    setTranslatedPoem(null);
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setTranslatedPoem(null);
    setAudioDataUri(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
            <PhotoUploader onImageUpload={handleImageUpload} imagePreview={imagePreview} />

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Wand2 className="text-accent" />
                  Customize Your Poem
                </CardTitle>
                <CardDescription>Refine the AI's creative direction.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style" className="w-full">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free Verse">Free Verse</SelectItem>
                      <SelectItem value="Haiku">Haiku</SelectItem>
                      <SelectItem value="Sonnet">Sonnet</SelectItem>
                      <SelectItem value="Limerick">Limerick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={isLoading || !imagePreview} size="lg" className="w-full font-bold text-lg shadow-lg">
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Poem &amp; Captions
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col gap-6">
            {!isLoading && !poems && !captions && (
              <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-dashed border-2 animate-in fade-in-50 duration-500">
                <div className="space-y-4">
                  <h2 className="text-2xl font-headline text-muted-foreground">Your masterpiece awaits</h2>
                  <p className="text-muted-foreground">Upload a photo and let our AI craft a unique poem and captions for you.</p>
                </div>
              </Card>
            )}
            
            {(poems || isLoading) && (
              <PoemResult 
                poems={poems}
                selectedPoem={selectedPoem}
                translatedPoem={translatedPoem}
                onPoemSelect={handlePoemSelection}
                imagePreview={imagePreview} 
                isLoading={isLoading}
                audioDataUri={audioDataUri}
                isNarrating={isNarrating}
                isTranslating={isTranslating}
                onNarrate={handleNarration}
                onTranslate={handleTranslation}
                onSave={handleSaveToJournal}
                isSaving={isSaving}
                user={user}
                detectedTone={detectedTone}
              />
            )}

            {(captions || isLoading) && (
               <CaptionResult captions={captions} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
