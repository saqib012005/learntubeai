"use client";

import React from 'react';
import AppHeader from '@/components/app/header';
import UrlInputForm from '@/components/app/url-input-form';
import TranscriptEditor from '@/components/app/transcript-editor';
import FeatureButtons from '@/components/app/feature-buttons';
import OutputSection from '@/components/app/output-section';
import { useAppStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { transcript, isFetchingTranscript, error } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <UrlInputForm />
          {error.transcript && <p className="text-destructive text-sm mt-2">{error.transcript}</p>}

          {(isFetchingTranscript || transcript) && (
            <div className="mt-8">
              <TranscriptEditor />
            </div>
          )}

          {isFetchingTranscript && (
             <div className="mt-8 space-y-4">
              <div className="animate-pulse bg-muted rounded-md h-8 w-1/4"></div>
              <div className="animate-pulse bg-muted rounded-md h-40 w-full"></div>
            </div>
          )}

          {transcript && !isFetchingTranscript && (
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
