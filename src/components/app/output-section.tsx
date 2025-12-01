'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
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
  
  const getFeatureContent = (feature: typeof features[number]) => {
    switch(feature) {
      case 'summary': return summary;
      case 'explanation': return explanation;
      case 'quiz': return Array.isArray(quiz) ? JSON.stringify(quiz, null, 2) : '';
      case 'flashcards': return flashcards.length > 0 ? JSON.stringify(flashcards, null, 2) : '';
      case 'timeline': return timeline.length > 0 ? JSON.stringify(timeline, null, 2) : '';
      default: return '';
    }
  }

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
        return Array.isArray(quiz) && quiz.length > 0 ? (
          <div className="space-y-6">
            {quiz.map((q: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-base">Q{index + 1}: {q.question}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                      {q.type?.replace('-', ' ') || 'Question'}
                    </span>
                  </div>
                  
                  {q.type === 'multiple-choice' && q.options && Array.isArray(q.options) && (
                    <div className="ml-4 space-y-2">
                      <p className="text-sm text-muted-foreground font-medium">Options:</p>
                      {q.options.map((opt: string, optIdx: number) => (
                        <div key={optIdx} className="text-sm">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="ml-4 space-y-2 bg-accent/50 p-3 rounded">
                    <p className="text-sm font-semibold">Correct Answer:</p>
                    <p className="text-sm text-foreground">{q.correctAnswer}</p>
                  </div>
                  
                  <div className="ml-4 space-y-2 bg-blue-50 dark:bg-blue-950 p-3 rounded">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Explanation:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{q.explanation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null;
      case 'flashcards':
        return flashcards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card, index) => (
              <div
                key={index}
                className="h-72 cursor-pointer"
                onClick={() => setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }))}
                style={{ perspective: '1000px' }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front Side - Question */}
                  <div
                    className="absolute w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    <Card className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-2 border-blue-200 dark:border-blue-700">
                      <CardHeader className="text-center w-full">
                        <CardDescription className="text-blue-600 dark:text-blue-300 font-semibold">Question</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center flex-1 flex items-center">
                        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{card.question}</p>
                      </CardContent>
                      <div className="text-xs text-blue-500 dark:text-blue-400 mt-4">Click to reveal answer</div>
                    </Card>
                  </div>

                  {/* Back Side - Answer */}
                  <div
                    className="absolute w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Card className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-2 border-green-200 dark:border-green-700">
                      <CardHeader className="text-center w-full">
                        <CardDescription className="text-green-600 dark:text-green-300 font-semibold">Answer</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center flex-1 flex items-center">
                        <p className="text-base text-green-900 dark:text-green-100">{card.answer}</p>
                      </CardContent>
                      <div className="text-xs text-green-500 dark:text-green-400 mt-4">Click to flip back</div>
                    </Card>
                  </div>
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
      case 'quiz': return Array.isArray(quiz) && quiz.length > 0;
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
          
          const contentToCopy = getFeatureContent(feature);

          return (
            <TabsContent key={feature} value={feature}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="capitalize">{feature}</CardTitle>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyToClipboard(contentToCopy, feature)}
                      disabled={!contentToCopy}
                    >
                      <Copy className="h-4 w-4" />
                  </Button>
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
