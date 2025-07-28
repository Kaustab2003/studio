import Link from 'next/link';
import { Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
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
            <Button variant="ghost" disabled>Personal Gallery</Button>
        </div>
      </nav>
    </header>
  );
}
