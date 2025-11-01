'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Copy, FlipHorizontal } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

const features = ['summary', 'explanation', 'flashcards', 'quiz', 'timeline'] as const;

export default function OutputSection() {
  const { isLoading, error, summary, explanation, flashcards, quiz, timeline } = useAppStore();
  const { toast } = useToast();
  const [flippedCards, setFlippedCards] = React.useState<Record<number, boolean>>({});

  const handleCopyToClipboard = (content: string, featureName: string) => {
    copyToClipboard(content)
      .then(() => toast({ title: 'Copied to clipboard!', description: `${featureName} has been copied.` }))
      .catch(() => toast({ variant: 'destructive', title: 'Failed to copy', description: 'Could not copy to clipboard.' }));
  };

  const renderContent = (feature: typeof features[number]) => {
    if (isLoading[feature]) {
      return <Skeleton className="h-40 w-full" />;
    }
    if (error[feature]) {
      return <p className="text-destructive">{error[feature]}</p>;
    }

    switch (feature) {
      case 'summary':
        return summary ? (
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{summary}</div>
        ) : null;
      case 'explanation':
        return explanation ? (
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{explanation}</div>
        ) : null;
      case 'quiz':
        return quiz ? (
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{quiz}</div>
        ) : null;
      case 'flashcards':
        return flashcards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, index) => (
              <div
                key={index}
                className="relative perspective-1000 h-64"
                onClick={() => setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }))}
              >
                <div
                  className={`absolute w-full h-full transform-style-3d transition-transform duration-500 ${flippedCards[index] ? 'rotate-y-180' : ''}`}
                >
                  <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-4">
                    <CardHeader>
                      <CardDescription>Question</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">{card.question}</CardContent>
                  </Card>
                  <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4">
                    <CardHeader>
                      <CardDescription>Answer</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">{card.answer}</CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        ) : null;
      case 'timeline':
        return timeline.length > 0 ? (
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && <div className="w-px h-16 bg-border"></div>}
                </div>
                <div>
                  <p className="font-semibold text-primary">{event.timestamp}</p>
                  <p className="text-muted-foreground">{event.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const generatedFeatures = features.filter(f => {
    switch(f) {
      case 'summary': return !!summary;
      case 'explanation': return !!explanation;
      case 'flashcards': return flashcards.length > 0;
      case 'quiz': return !!quiz;
      case 'timeline': return timeline.length > 0;
      default: return false;
    }
  });

  if (generatedFeatures.length === 0 && !features.some(f => isLoading[f])) return null;

  return (
    <div className="mt-8">
      <Tabs defaultValue={generatedFeatures[0] || 'summary'}>
        <TabsList>
          {features.map((f) => (isLoading[f] || (renderContent(f) !== null)) && <TabsTrigger key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</TabsTrigger>)}
        </TabsList>
        {features.map((feature) => {
          const content = renderContent(feature);
          if (!content) return null;
          return (
            <TabsContent key={feature} value={feature}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize flex justify-between items-center">
                    {feature}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyToClipboard(
                        feature === 'flashcards' ? JSON.stringify(flashcards, null, 2) :
                        feature === 'timeline' ? JSON.stringify(timeline, null, 2) :
                        (eval(feature) as string),
                        feature
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="p-1">{content}</div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
