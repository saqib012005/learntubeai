"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

function extractVideoId(url?: string | null) {
  if (!url) return null;
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const u = new URL(normalized);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch (e) {
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : null;
  }
  return null;
}

export default function TranscriptEditorAuto() {
  const { transcript, setTranscript, youtubeUrl, selectedLanguages, setTranscriptSegments } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  const setFetching = useCallback((val: boolean) => {
    try {
      (useAppStore as any).setState({ isFetchingTranscript: val });
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setError(null);
      return;
    }

    setError(null);
    setLoading(true);
    setFetching(true);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const langs = (selectedLanguages || []).join(',');
        const url = `/api/transcript?videoId=${encodeURIComponent(videoId)}${langs ? `&langs=${encodeURIComponent(langs)}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('Transcript API response:', data);
        if (!res.ok || data.error) {
          setError(data.error || 'Transcript not available');
          setTranscriptSegments([]);
        } else if (data.transcriptText || data.segments) {
          if (typeof data.transcriptText === 'string') {
            setTranscript(data.transcriptText);
          } else if (typeof data.transcript === 'string') {
            // fallback
            setTranscript(data.transcript);
          } else if (data.transcript && Array.isArray(data.transcript)) {
            const text = data.transcript.map((t: any) => (t.text || t.caption || '').trim()).filter(Boolean).join(' ');
            setTranscript(text);
          }
          // set segments (may be undefined)
          if (Array.isArray(data.segments)) {
            setTranscriptSegments(data.segments);
          } else if (Array.isArray(data.transcript)) {
            // try to normalize transcript array into segments
            const segs = data.transcript.map((t: any) => ({ text: t.text || t.caption || '', start: t.offset ?? t.start ?? null, duration: t.duration ?? null }));
            setTranscriptSegments(segs);
          } else {
            setTranscriptSegments([]);
          }
          setError(null);
        } else {
          console.log('Unexpected transcript format:', typeof data, data);
          setError('Unexpected transcript format');
          setTranscriptSegments([]);
        }
      } catch (e: any) {
        console.error('Fetch error:', e);
        setError(e?.message || 'Network error while fetching transcript');
        setTranscriptSegments([]);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [youtubeUrl, setTranscript, setFetching]);

  return (
    <div className="relative">
      <Textarea
        id="video-transcript"
        value={transcript}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTranscript(e.target.value)}
        className="min-h-[250px] text-base leading-relaxed"
        placeholder="Paste your transcript here, or it will appear after fetching from a URL."
        disabled={loading}
      />

      <div className="mt-2 text-sm">
        {loading && <span className="text-muted-foreground">Fetching transcript…</span>}
        {!loading && error && <span className="text-destructive">{error}</span>}
      </div>
    </div>
  );
}
