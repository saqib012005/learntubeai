import { NextResponse } from 'next/server';

type CacheEntry = {
  transcriptText: string | null;
  segments: Array<{ text: string; start?: number; duration?: number }> | null;
  expiresAt: number;
};

// Simple in-memory cache with TTL
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const cache = new Map<string, CacheEntry>();

function cacheKey(videoId: string, langs: string[]) {
  return `${videoId}::${langs.join(',')}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoId = url.searchParams.get('videoId');
  const langsParam = url.searchParams.get('langs');

  if (!videoId || typeof videoId !== 'string') {
    return NextResponse.json({ error: 'videoId is required and must be a string' }, { status: 400 });
  }

  const defaultLangs = ['en', 'en-US', 'en-GB', 'es', 'fr', 'de'];
  const langs = langsParam ? langsParam.split(',').map(s => s.trim()).filter(Boolean) : defaultLangs;

  const key = cacheKey(videoId.trim(), langs);
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ transcriptText: cached.transcriptText, segments: cached.segments, cached: true });
  }

  const apiKey = process.env.YT_TRANSCRIPT_API_KEY;
  const apiUrlBase = (process.env.YT_TRANSCRIPT_API_URL || 'https://www.youtube-transcript.io/api').replace(/\/+$/, '');

  if (!apiKey) {
    return NextResponse.json({ error: 'YT_TRANSCRIPT_API_KEY is not configured in environment' }, { status: 500 });
  }

  let finalTranscriptText: string | null = null;
  let finalSegments: Array<{ text: string; start?: number; duration?: number }> | null = null;

  // Try languages in order
  for (const lang of langs) {
    try {
      const resp = await fetch(`${apiUrlBase}/transcripts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${apiKey}`,
        },
        body: JSON.stringify({ ids: [videoId.trim()], lang }),
      });

      if (!resp.ok) {
        // try next language
        console.warn('[transcript] external returned', resp.status, await resp.text());
        continue;
      }

      const json = await resp.json();
      // normalize
      let entry: any = null;
      if (Array.isArray(json)) {
        entry = json.find((it: any) => (it?.id || it?.videoId || it?.youtubeId) == videoId) || json[0];
      } else if (json.transcripts && Array.isArray(json.transcripts)) {
        entry = json.transcripts.find((it: any) => (it?.id || it?.videoId || it?.youtubeId) == videoId) || json.transcripts[0];
      } else if (json.data && Array.isArray(json.data)) {
        entry = json.data.find((it: any) => (it?.id || it?.videoId || it?.youtubeId) == videoId) || json.data[0];
      } else if (json[videoId]) {
        entry = json[videoId];
      } else {
        entry = json;
      }

      if (!entry) continue;

      // If there's segments array, capture them
      if (entry.segments && Array.isArray(entry.segments) && entry.segments.length) {
        finalSegments = entry.segments.map((s: any) => ({ text: (s.text || s.caption || '').trim(), start: s.start ?? s.offset ?? undefined, duration: s.duration ?? undefined })).filter((s: any) => s.text);
        // prettify text
        const punctuated = (finalSegments || []).map(s => {
          const t = s.text;
          const last = t.slice(-1);
          if (/[.?!,;:]$/.test(last)) return t;
          return t + '.';
        });
        let joined = punctuated.join(' ').replace(/\s+/g, ' ').trim();
        joined = joined.split('. ').map((ss: string) => ss.trim()).filter(Boolean).map((ss: string) => ss[0]?.toUpperCase() + ss.slice(1)).join('. ');
        if (joined && !/[.?!]$/.test(joined)) joined += '.';
        finalTranscriptText = joined;
      }

      // If there's text string
      else if (typeof entry.text === 'string' && entry.text.trim()) {
        finalTranscriptText = entry.text.trim();
      }

      // If there's transcript array of pieces {text,start,duration}
      else if (entry.transcript && Array.isArray(entry.transcript) && entry.transcript.length) {
        finalSegments = entry.transcript.map((p: any) => ({ text: (p.text || p.caption || '').trim(), start: p.start ?? p.offset ?? undefined, duration: p.duration ?? undefined })).filter((s: any) => s.text);
        const joined = (finalSegments || []).map(s => s.text).join(' ').replace(/\s+/g, ' ').trim();
        finalTranscriptText = joined;
      }

      // If entry is just a raw string
      else if (typeof entry === 'string' && entry.trim()) {
        finalTranscriptText = entry.trim();
      }

      if (finalTranscriptText || (finalSegments && finalSegments.length)) {
        break;
      }
    } catch (e) {
      console.warn('[transcript] attempt failed for lang', lang, e);
      continue;
    }
  }

  if (!finalTranscriptText && !(finalSegments && finalSegments.length)) {
    return NextResponse.json({ error: 'No transcript found for this video (external API returned no text).' }, { status: 404 });
  }

  // cache
  cache.set(key, { transcriptText: finalTranscriptText, segments: finalSegments, expiresAt: Date.now() + CACHE_TTL_MS });

  return NextResponse.json({ transcriptText: finalTranscriptText, segments: finalSegments });
}
 
