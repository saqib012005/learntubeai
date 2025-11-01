"use client";

import React from 'react';
import AppHeader from '@/components/app/header';
import TranscriptEditor from '@/components/app/transcript-editor';
import FeatureButtons from '@/components/app/feature-buttons';
import OutputSection from '@/components/app/output-section';
import { useAppStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { transcript } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
           <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Learn from any video</h2>
            <p className="text-muted-foreground">
              Paste a video transcript below to get started. You can generate notes, summaries, quizzes, and more with AI.
            </p>
          </div>
          
          <div className="mt-8">
            <TranscriptEditor />
          </div>

          {transcript && (
            <div className="mt-8">
              <Separator className="my-8" />
              <FeatureButtons />
              <OutputSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
