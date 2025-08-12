'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { summarizePaste } from '@/ai/flows/summarize-paste';
import {
  Loader2,
  Share2,
  ClipboardCopy,
  Wand2,
  Link as LinkIcon,
  BrainCircuit,
  Palette,
} from 'lucide-react';
import { createPaste } from '@/lib/pastes';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from './layout';

export default function Home() {
  const [pasteContent, setPasteContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [ttl, setTtl] = useState('1d');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  }

  const handleSummarize = async () => {
    if (!pasteContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some text to summarize.',
      });
      return;
    }
    setIsSummarizing(true);
    setSummary('');
    try {
      const result = await summarizePaste({ pasteContent });
      setSummary(result.summary);
      toast({
        title: 'Success!',
        description: 'Your text has been summarized.',
      });
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description:
          'Could not summarize the text. Please try again later.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleShare = () => {
    if (!pasteContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter some text to share.',
      });
      return;
    }
    setIsSharing(true);
    setGeneratedLink('');

    // Optimistically generate link
    const id = uuidv4();
    const link = `${window.location.origin}/p/${id}`;
    setGeneratedLink(link);
    
    toast({
      title: 'Link Generated!',
      description: 'Your paste is ready to be shared.',
    });

    // Create paste in the background
    createPaste({ id, content: pasteContent, ttl })
      .catch((error) => {
        console.error('Sharing error:', error);
        toast({
          variant: 'destructive',
          title: 'Sharing Failed',
          description:
            'Could not save the paste. The link may not work.',
        });
        setGeneratedLink(''); // Clear the link if saving failed
      })
      .finally(() => {
        setIsSharing(false);
      });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: 'Copied!',
          description: 'The link has been copied to your clipboard.',
        });
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        toast({
          variant: 'destructive',
          title: 'Copy Failed',
          description: 'Could not copy the link.',
        });
      });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <Card className="shadow-2xl rounded-xl overflow-hidden transition-all duration-300 ease-in-out border-2 border-primary/20">
          <CardHeader className="text-center bg-card-foreground/5 relative">
            <div className="absolute top-4 right-4">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-[140px]">
                  <Palette className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="hacker">Matrix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center items-center gap-4 mb-2">
              <BrainCircuit className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-3xl font-bold font-headline tracking-tight">
                  SynapseShare
                </CardTitle>
                <CardDescription className="text-lg">
                  Paste, Share, and Summarize with AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              placeholder="> Paste your text, code, or anything else here..."
              className="min-h-[250px] w-full resize-y rounded-lg border-2 border-dashed bg-transparent p-4 text-base focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 font-code"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-foreground/5 p-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="ttl" className="whitespace-nowrap">
                Auto-delete in:
              </Label>
              <Select defaultValue={ttl} onValueChange={setTtl}>
                <SelectTrigger id="ttl" className="w-[120px]">
                  <SelectValue placeholder="TTL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10m">10 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="1w">1 week</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={handleSummarize}
                disabled={isSummarizing || isSharing}
                variant="outline"
              >
                {isSummarizing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand2 />
                )}
                Summarize
              </Button>
              <Button onClick={handleShare} disabled={isSharing || isSummarizing}>
                {isSharing ? <Loader2 className="animate-spin" /> : <Share2 />}
                Share
              </Button>
            </div>
          </CardFooter>
        </Card>

        {generatedLink && (
          <Card className="shadow-lg rounded-xl animate-in fade-in-50 slide-in-from-bottom-5 duration-500 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <LinkIcon className="text-primary" />
                Your Shareable Link
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-grow rounded-lg bg-muted p-4">
                <p className="font-code text-sm sm:text-base text-primary overflow-x-auto">
                  {generatedLink}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(generatedLink)}
              >
                <ClipboardCopy />
              </Button>
              <div className="bg-white p-2 rounded-lg">
                <QRCode value={generatedLink} size={80} />
              </div>
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card className="shadow-lg rounded-xl animate-in fade-in-50 slide-in-from-bottom-5 duration-500 border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Wand2 className="text-accent" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 whitespace-pre-wrap">
                {summary}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
