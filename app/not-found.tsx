import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md space-y-8 p-8 text-center bg-card border border-border rounded-lg">
        <div className="flex justify-center">
          <Frown className="size-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          404: Page Ghosted
        </h1>
        <p className="text-base text-muted-foreground">
          Looks like the page you're looking for has blocked you, moved on, or maybe it never existed in the first place. Time to go back and focus on your own reformat.
        </p>
        <Link href="/" passHref>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}