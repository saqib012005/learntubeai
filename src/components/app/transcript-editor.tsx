'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { useAppStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, Copy, Brain, MessageSquareQuote } from 'lucide-react';
import { downloadTextFile, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function TranscriptEditor() {
  const { transcript, setTranscript, generateFeature, isLoading } = useAppStore();
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const popoverAnchorRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    downloadTextFile(transcript, 'transcript.txt');
  };

  const handleCopy = () => {
    copyToClipboard(transcript).then(() => {
      toast({ title: 'Success', description: 'Transcript copied to clipboard.' });
    });
  };

  const handleMouseUp = (event: MouseEvent<HTMLTextAreaElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 10) {
      setSelectedText(selection);

      const a = popoverAnchorRef.current;
      if (a) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        a.style.top = `${y}px`;
        a.style.left = `${x}px`;
      }
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

  const handlePopoverAction = (feature: 'explanation' | 'flashcards') => {
    generateFeature(feature, selectedText);
    setPopoverOpen(false);
  };
  
  return (
    <div className="space-y-4 relative">
      <h3 className="text-2xl font-semibold">Transcript</h3>
      <div className="relative">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[250px] text-base leading-relaxed"
          placeholder="Your video transcript will appear here..."
          onMouseUp={handleMouseUp}
          onBlur={() => setTimeout(() => setPopoverOpen(false), 200)}
        />
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div ref={popoverAnchorRef} style={{ position: 'absolute' }} />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePopoverAction('explanation')}
                disabled={isLoading.explanation}
              >
                <Brain className="mr-2" /> Explain
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePopoverAction('flashcards')}
                disabled={isLoading.flashcards}
              >
                <MessageSquareQuote className="mr-2" /> Flashcard
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2" /> Download
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Copy className="mr-2" /> Copy
        </Button>
      </div>
    </div>
  );
}
