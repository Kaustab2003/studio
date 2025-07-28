
import Link from 'next/link';
import { Feather, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  // Mock user state - in a real app, this would come from an auth context
  const user = null;

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
           {user ? (
             <Button asChild variant="ghost">
                <Link href="/gallery">Personal Gallery</Link>
             </Button>
           ) : (
             <Button asChild>
                <Link href="/sign-in">
                    <User className="mr-2" />
                    Sign In
                </Link>
             </Button>
           )}
        </div>
      </nav>
    </header>
  );
}
