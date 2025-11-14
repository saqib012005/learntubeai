'use client';

import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  url: string;
  onFrameCapture: (dataUri: string) => void;
}

export default function VideoPlayer({ url, onFrameCapture }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const { toast } = useToast();

  const handleCaptureFrame = () => {
    if (!playerRef.current) {
        toast({
            variant: 'destructive',
            title: 'Player not ready',
            description: 'The video player has not loaded yet.'
        });
        return;
    }

    try {
        const internalPlayer = playerRef.current.getInternalPlayer();

        if (!internalPlayer) {
            throw new Error("Could not access internal video player. This might be due to the video source's restrictions.");
        }

        // This works for standard <video> elements, which react-player uses for many sources like direct file links.
        if (internalPlayer instanceof HTMLVideoElement) {
            const videoElement = internalPlayer;
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const dataUri = canvas.toDataURL('image/jpeg');
                onFrameCapture(dataUri);
            } else {
                throw new Error('Could not get canvas context.');
            }
        } else {
             // Fallback for iframe-based players like YouTube
             const playerElement = playerRef.current.wrapper as HTMLElement;
             const iframe = playerElement.querySelector('iframe');
             if(iframe) {
                toast({
                    variant: 'destructive',
                    title: 'Frame capture not supported',
                    description: 'Capturing frames from this video provider (e.g., YouTube) is not possible due to browser security restrictions.'
                });
             } else {
                throw new Error('Unsupported player type. No <video> or <iframe> element found.');
             }
        }
    } catch (error: any) {
        console.error("Frame capture failed:", error);
        toast({
            variant: 'destructive',
            title: 'Frame Capture Failed',
            description: error.message || 'An unknown error occurred while capturing the frame.',
        });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            controls
            onError={(e) => console.error('ReactPlayer Error:', e)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCaptureFrame} variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Capture Frame to Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
