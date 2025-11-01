'use client';
import { BrainCircuit, Milestone } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggleButton } from '../theme-toggle-button';
import { Button } from '../ui/button';

export default function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                LearnTube AI
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/">Video Study</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/roadmap">AI Roadmap</Link>
                </Button>
            </nav>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
}
