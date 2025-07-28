
'use client';

import Link from 'next/link';
import { Feather, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="p-4 border-b">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold font-headline tracking-tight">
                Photo Poet
            </h1>
        </Link>
        <div className="flex items-center gap-2">
           {!loading && user ? (
             <>
               <Button asChild variant="ghost">
                  <Link href="/gallery">Personal Gallery</Link>
               </Button>
               <Button onClick={handleSignOut} variant="outline">
                 <LogOut className="mr-2" />
                 Sign Out
               </Button>
             </>
           ) : !loading ? (
             <Button asChild>
                <Link href="/sign-in">
                    <User className="mr-2" />
                    Sign In
                </Link>
             </Button>
           ) : null}
        </div>
      </nav>
    </header>
  );
}
