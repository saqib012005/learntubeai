'use client';

import React, { useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VideoPlayerProps {
  url: string;
  onFrameCapture: (dataUri: string) => void;
}

export default function VideoPlayer({ url, onFrameCapture }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);

  const handleCaptureFrame = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player && typeof (player as any).getInternalPlayer === 'function') {
        const videoElement = (player as any).getInternalPlayer() as HTMLVideoElement;
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const dataUri = canvas.toDataURL('image/jpeg');
          onFrameCapture(dataUri);
        }
      } else {
        // Fallback for players that don't expose the video element directly
        // This may not work for all URLs due to cross-origin restrictions
        try {
            const canvas = document.createElement('canvas');
            // @ts-ignore
            const videoElement = playerRef.current.getInternalPlayer();
            canvas.width = videoElement.clientWidth;
            canvas.height = videoElement.clientHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const dataUri = canvas.toDataURL('image/jpeg');
                onFrameCapture(dataUri);
            }
        } catch (error) {
            console.error("Frame capture failed:", error);
            alert("Could not capture frame. This may be due to browser security restrictions (CORS).");
        }
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            controls
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
