'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, CornerDownLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export default function ChatPanel() {
    const { chatHistory, sendChatMessage, isLoading, transcript, selectedLanguages, setSelectedLanguages } = useAppStore();
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

    const handleLanguageChange = (val: string) => {
        if (!val) return;
        setSelectedLanguages([val]);
    };

  const handleTimestampClick = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return;
    // This is where video player seeking logic will be fully implemented.
    // For now, it's a placeholder.
    console.log(`Jumping to ${seconds} seconds`);
  };

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Ask a doubt</h2>
        <div className="flex flex-col h-[60vh] rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex-grow overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-4 space-y-4">
                        {chatHistory.length === 0 && (
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
                                    <p className="text-sm whitespace-pre-wrap">{chat.content.answer}</p>
                                    {chat.content.timestamp && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="p-0 h-auto text-accent-foreground/80"
                                            onClick={() => handleTimestampClick(chat.content.seconds)}
                                        >
                                            Jump to {chat.content.timestamp}
                                        </Button>
                                    )}
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
                        <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                                        <div style={{width: 160}}>
                                            <Select onValueChange={handleLanguageChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue>{(selectedLanguages && selectedLanguages[0]) || 'en'}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="en">English</SelectItem>
                                                        <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                                                        <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                                                        <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                                                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                                                        <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                                        <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                                                        <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                                                        <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                                                        <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                                                        <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                                                        <SelectItem value="as">অসমীয়া (Assamese)</SelectItem>
                                                        <SelectItem value="kok">कोंकणी (Konkani)</SelectItem>
                                                        <SelectItem value="sa">संस्कृत (Sanskrit)</SelectItem>
                                                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                                                        <SelectItem value="mai">मैथिली (Maithili)</SelectItem>
                                                        <SelectItem value="doi">डोगरी (Dogri)</SelectItem>
                                                        <SelectItem value="mni">মণিপুরী (Manipuri)</SelectItem>
                                                        <SelectItem value="es">Español (Spanish)</SelectItem>
                                                        <SelectItem value="fr">Français (French)</SelectItem>
                                                        <SelectItem value="de">Deutsch (German)</SelectItem>
                                                        <SelectItem value="pt">Português (Portuguese)</SelectItem>
                                                        <SelectItem value="zh">中文 (Chinese)</SelectItem>
                                                        <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                                                        <SelectItem value="ko">한국어 (Korean)</SelectItem>
                                                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                                                        <SelectItem value="ru">Русский (Russian)</SelectItem>
                                                        <SelectItem value="it">Italiano (Italian)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Input
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Ask a question about the video..."
                                                className="flex-1 pr-16"
                                                disabled={isLoading.chat || !transcript}
                                        />
                                        <Button 
                                                type="submit" 
                                                size="icon" 
                                                className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-10"
                                                disabled={isLoading.chat || !transcript}
                                        >
                                                <CornerDownLeft className="h-4 w-4" />
                                        </Button>
                                </form>
                        </div>
        </div>
    </div>
  );
}
