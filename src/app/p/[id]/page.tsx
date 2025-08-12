'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPaste } from '@/lib/pastes';
import { notFound } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Paste({ params }: { params: { id: string } }) {
  const [pasteContent, setPasteContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const content = await getPaste(params.id);
        if (content === null) {
          notFound();
        } else {
          setPasteContent(content);
        }
      } catch (error) {
        console.error('Failed to fetch paste:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchPaste();
  }, [params.id]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-card-foreground/5">
            <div className="flex justify-center items-center gap-4 mb-2">
              <BrainCircuit className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                  SynapseShare
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <pre className="min-h-[250px] w-full whitespace-pre-wrap rounded-lg bg-muted p-4 font-code text-base">
                {pasteContent}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
