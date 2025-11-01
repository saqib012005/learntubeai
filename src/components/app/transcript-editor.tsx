'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';

export default function TranscriptEditor() {
  const { transcript, setTranscript, isFetchingTranscript } = useAppStore();
  
  return (
    <div className="relative">
      <Textarea
        id="video-transcript"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="min-h-[250px] text-base leading-relaxed"
        placeholder="Paste your transcript here, or it will appear after fetching from a URL."
        disabled={isFetchingTranscript}
      />
    </div>
  );
}
