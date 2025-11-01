'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ThemeToggleButton } from '../theme-toggle-button';
import { BrainCircuit } from 'lucide-react';
import ChatPanel from './chat-panel';

export default function AppHeader() {
  const logo = PlaceHolderImages.find((img) => img.id === 'logo');

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              LearnTube AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ChatPanel />
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
}
