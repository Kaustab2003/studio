
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Poem } from '@/types/poem';
import GalleryItem from '@/components/gallery-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [poemsLoading, setPoemsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchPoems = async () => {
      try {
        const q = query(
          collection(db, 'poems'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const userPoems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Poem[];
        setPoems(userPoems);
      } catch (error) {
        console.error("Error fetching poems: ", error);
      } finally {
        setPoemsLoading(false);
      }
    };

    fetchPoems();
  }, [user, authLoading, router]);

  if (authLoading || poemsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-9 w-1/3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">My Poetry Journal</h1>
          </div>
          {poems.length === 0 ? (
            <Card className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-dashed border-2">
              <CardHeader>
                <CardTitle>Your Gallery is Empty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You haven&apos;t saved any poems yet.</p>
                <Button onClick={() => router.push('/')} className="mt-4">Create your first poem</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {poems.map((poem) => (
                <GalleryItem key={poem.id} poem={poem} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
