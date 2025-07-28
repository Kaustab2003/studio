
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Feather } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords do not match',
      });
      return;
    }
    setIsLoading(true);
    // This is where Firebase authentication logic will go.
    // For now, we'll simulate a successful sign-up.
     setTimeout(() => {
      toast({
        title: "Account Created!",
        description: "You've been signed in.",
      });
      router.push('/gallery');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
         <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Feather className="h-8 w-8 text-accent" />
                <h1 className="text-4xl font-bold font-headline tracking-tight">
                    Photo Poet
                </h1>
            </Link>
            <p className="text-muted-foreground">Create an account to save your poems.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
