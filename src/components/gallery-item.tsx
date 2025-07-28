
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Poem } from '@/types/poem';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type GalleryItemProps = {
  poem: Poem;
};

export default function GalleryItem({ poem }: GalleryItemProps) {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    // A confirmation dialog would be good here in a real app
    try {
        await deleteDoc(doc(db, "poems", poem.id));
        toast({
            title: "Poem Deleted",
            description: "The poem has been removed from your journal.",
        });
        // Here you would typically trigger a state update in the parent to remove the item from the UI
        window.location.reload();
    } catch (error) {
        console.error("Error deleting poem: ", error);
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the poem. Please try again.",
        });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image src={poem.imageUrl} alt="Poem image" layout="fill" objectFit="cover" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground whitespace-pre-wrap italic leading-relaxed">{poem.poem}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
            <p>Style: {poem.style}, Tone: {poem.tone}</p>
            <p>Language: {poem.language}</p>
            <p>Created: {new Date(poem.createdAt.seconds * 1000).toLocaleDateString()}</p>
        </div>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
