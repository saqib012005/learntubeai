'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAppStore } from '@/lib/store';
import { WandSparkles } from 'lucide-react';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid YouTube URL.' }),
});

type FormData = z.infer<typeof FormSchema>;

export default function UrlInputForm() {
  const { fetchTranscript, isFetchingTranscript } = useAppStore();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    fetchTranscript(data.url);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Learn from any video</h2>
      <p className="text-muted-foreground">
        Paste a YouTube link to get started. The transcript will be fetched, and you can generate notes, summaries, quizzes, and more with AI.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isFetchingTranscript} className="h-10">
            <WandSparkles className="mr-2" />
            {isFetchingTranscript ? 'Fetching...' : 'Fetch Transcript'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
