
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
  const [poems, setPoems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock user state
  const [user, setUser] = useState<{uid: string} | null>({uid: 'mock-user'});

  useEffect(() => {
    // Mock fetching poems
    setTimeout(() => {
      if (user) {
        // In a real app, you would fetch from Firestore here
        setPoems([]); // Start with empty, as we don't have real data yet
      }
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const handleSignOut = () => {
    // In a real app, this would be firebase.auth().signOut()
    setUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p>Loading your gallery...</p>
        </main>
      </div>
    );
  }

  if (!user) {
     router.push('/sign-in');
     return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">My Poetry Journal</h1>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
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
              {/* Poem cards will be rendered here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
