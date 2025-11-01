'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { AlignLeft, Lightbulb, Blocks, HelpCircle, Milestone } from 'lucide-react';

const features = [
  { id: 'summary', label: 'Summarize', icon: AlignLeft },
  { id: 'explanation', label: 'Explain Simply', icon: Lightbulb },
  { id: 'flashcards', label: 'Flashcards', icon: Blocks },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'timeline', label: 'Timeline', icon: Milestone },
] as const;

export default function FeatureButtons() {
  const { generateFeature, isLoading } = useAppStore();

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Generate with AI</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="outline"
            size="lg"
            className="flex flex-col h-24 items-center justify-center gap-2 text-center"
            onClick={() => generateFeature(feature.id)}
            disabled={isLoading[feature.id]}
          >
            <feature.icon className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">{feature.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
