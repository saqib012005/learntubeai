'use client';

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function ChatPanel() {
  const { chatHistory, sendChatMessage, isLoading, transcript } = useAppStore();
  const [message, setMessage] = React.useState('');
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="mr-2" /> AI Tutor
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>AI Chat Tutor</SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {chatHistory.length === 0 && !transcript && (
                <div className="text-center text-muted-foreground p-8">
                  <p>Please fetch a transcript first to start chatting with the AI tutor.</p>
                </div>
              )}
              {chatHistory.length === 0 && transcript && (
                 <div className="text-center text-muted-foreground p-8">
                  <p>Ask me anything about the video content!</p>
                </div>
              )}
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    chat.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {chat.role === 'assistant' && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[80%]',
                      chat.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                  </div>
                  {chat.role === 'user' && (
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading.chat && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted">
                        <Skeleton className="h-5 w-20" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading.chat || !transcript}
            />
            <Button type="submit" size="icon" disabled={isLoading.chat || !transcript}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
