'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, type ActionResult } from './actions';
import Link from 'next/link';
import { useEffect } from 'react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
      {pending ? 'Logging in...' : 'Login'}
    </Button>
  );
}

const initialState: ActionResult = {
  error: null,
  success: false,
};

export default function SignInPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-[350px] gap-6 p-8 border border-border rounded-lg bg-card">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-balance text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>
        </div>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              required 
              className="bg-muted border-border text-foreground"
            />
          </div>
          {state?.error && (
            <div className="text-sm font-medium text-destructive text-center" role="alert">
              {state.error}
            </div>
          )}
          <LoginButton />
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="underline text-accent hover:text-accent-foreground">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}