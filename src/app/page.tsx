"use client";

import React from 'react';
import AppHeader from '@/components/app/header';
import TranscriptEditor from '@/components/app/transcript-editor';
import OutputSection from '@/components/app/output-section';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import ChatPanel from '@/components/app/chat-panel';

export default function Home() {
  const { transcript, generateAllFeatures, isLoading, youtubeUrl, setYoutubeUrl } = useAppStore();

  const isGenerating = Object.values(isLoading).some(val => val);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
           <div className="space-y-2 text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Start Studying from Video</h1>
            <p className="text-lg text-muted-foreground">
              Provide a YouTube link and the video's transcript to begin.
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium mb-2">YouTube URL</label>
              <Input 
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            
            <div>
               <label htmlFor="video-transcript" className="block text-sm font-medium mb-2">Video Transcript</label>
              <TranscriptEditor />
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={() => generateAllFeatures()}
                disabled={!transcript || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Study Kit'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {transcript && (
            <>
              <div className="my-8 border-t" />
              <ChatPanel />
            </>
          )}


          <OutputSection />
        </div>
      </main>
    </div>
  );
}
