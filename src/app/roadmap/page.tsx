'use client';

import React from 'react';
import AppHeader from '@/components/app/header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { ArrowRight, Book, FlaskConical, ListTodo, Milestone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

export default function RoadmapPage() {
  const {
    roadmapTopic,
    setRoadmapTopic,
    roadmap,
    generateRoadmap,
    isLoading,
    error,
  } = useAppStore();

  const handleGenerateRoadmap = () => {
    if (roadmapTopic) {
      generateRoadmap(roadmapTopic);
    }
  };

  const isGenerating = isLoading.roadmap;

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">
              AI Learning Roadmap Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter a topic and get a personalized, step-by-step learning plan.
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="e.g., 'Machine Learning', 'Organic Chemistry', 'SQL for Data Analysis'"
              className="min-h-[100px] text-base"
              value={roadmapTopic}
              onChange={(e) => setRoadmapTopic(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleGenerateRoadmap}
                disabled={!roadmapTopic || isGenerating}
              >
                {isGenerating ? 'Generating Roadmap...' : 'Generate Roadmap'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="mt-12 space-y-8">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
          )}
          
          {error.roadmap && (
            <div className="mt-12 text-center text-destructive">
                <p>Failed to generate roadmap: {error.roadmap}</p>
            </div>
          )}

          {roadmap && !isGenerating && (
            <div className="mt-12 space-y-8">
              <h2 className="text-3xl font-bold text-center">
                Your Roadmap for "{roadmap.topic}"
              </h2>

              <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                {roadmap.levels.map((level, levelIndex) => (
                  <AccordionItem value={`item-${levelIndex}`} key={levelIndex}>
                    <AccordionTrigger className="text-2xl font-semibold">
                      <div className="flex items-center gap-3">
                          <Milestone className="h-6 w-6 text-primary"/>
                          {level.stage}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="space-y-6">
                        {level.chapters.map((chapter, chapterIndex) => (
                          <Card key={chapterIndex}>
                            <CardHeader>
                              <CardTitle>{chapter.title}</CardTitle>
                              <CardDescription>Estimated time: {chapter.timeRequired}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p>{chapter.explanation}</p>
                              <div>
                                <h4 className="font-semibold mb-2">Videos:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {chapter.videoLinks.map((link, i) => (
                                    <li key={i}>
                                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Practice Tasks:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {chapter.practiceTasks.map((task, i) => (
                                    <li key={i}>{task}</li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FlaskConical/> Final Project Ideas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            {roadmap.finalProjectIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListTodo /> Revision Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{roadmap.revisionPlan}</p>
                    </CardContent>
                </Card>
              </div>

               <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Book /> Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Books:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {roadmap.resources.books.map((book, i) => <li key={i}>{book}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Cheat Sheets:</h4>
                             <ul className="list-disc pl-5 space-y-1">
                                {roadmap.resources.cheatSheets.map((sheet, i) => <li key={i}><a href={sheet} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{sheet}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Practice Sites:</h4>
                             <ul className="list-disc pl-5 space-y-1">
                                {roadmap.resources.practiceSites.map((site, i) => <li key={i}><a href={site} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{site}</a></li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
