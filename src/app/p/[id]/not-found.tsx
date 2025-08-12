'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md text-center">
        <Card className="shadow-2xl rounded-xl">
          <CardHeader>
            <div className="flex justify-center items-center gap-4 mb-2">
              <BrainCircuit className="w-10 h-10 text-primary" />
              <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                SynapseShare
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">Paste Not Found</h2>
            <p className="text-muted-foreground">
              This paste may have expired or the link might be incorrect.
            </p>
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go back to Homepage
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
