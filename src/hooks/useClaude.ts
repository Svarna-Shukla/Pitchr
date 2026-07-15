import { useCallback, useRef, useState } from "react";
import type { Slide } from "../types/slide";

const PROMPT = `Return ONE pitch deck slide as JSON only, no markdown:
{"title":"...","bullets":["...","...","..."],"type":"problem|solution|market|traction|team|ask"}`;

// Pulls a slide JSON object out of Claude's streamed text response
function parseSlide(text: string): Slide | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Slide;
  } catch {
    return null;
  }
}

// Calls the Claude API with streaming and returns one parsed slide
async function fetchSlide(chunk: string): Promise<Slide | null> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      stream: true,
      messages: [{ role: "user", content: `${PROMPT}\n\nTranscript:\n${chunk}` }],
    }),
  });
  if (!res.ok || !res.body) return null;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === "content_block_delta") full += data.delta?.text ?? "";
      } catch {
        /* skip malformed SSE chunks */
      }
    }
  }
  return parseSlide(full);
}

// Manages slide generation — queues transcript chunks and sends them to Claude
export function useClaude() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const sentIndex = useRef(0);
  const queue = useRef<string[]>([]);
  const processing = useRef(false);

  // Processes the next queued transcript chunk through Claude
  const processQueue = useCallback(async () => {
    if (processing.current || !queue.current.length) return;
    processing.current = true;
    setIsGenerating(true);
    const chunk = queue.current.shift()!;
    const slide = await fetchSlide(chunk);
    if (slide) setSlides((s) => [...s, slide]);
    processing.current = false;
    setIsGenerating(queue.current.length > 0);
    if (queue.current.length) processQueue();
  }, []);

  // Adds a transcript chunk to the generation queue
  const enqueue = useCallback(
    (text: string) => {
      queue.current.push(text);
      processQueue();
    },
    [processQueue]
  );

  // Watches the live transcript and sends every 2–3 sentences to Claude
  const feedTranscript = useCallback(
    (full: string) => {
      const unsent = full.slice(sentIndex.current);
      const matches = [...unsent.matchAll(/[^.!?]+[.!?]+/g)];
      if (matches.length < 2) return;
      const count = Math.min(3, matches.length);
      const chunk = matches.slice(0, count).map((m) => m[0]).join(" ");
      sentIndex.current += chunk.length;
      enqueue(chunk);
    },
    [enqueue]
  );

  // Sends any remaining unsent transcript when recording stops
  const flush = useCallback(
    (full: string) => {
      const rest = full.slice(sentIndex.current).trim();
      if (rest) enqueue(rest);
    },
    [enqueue]
  );

  // Clears all slides and resets the sent-transcript tracker
  const reset = useCallback(() => {
    setSlides([]);
    sentIndex.current = 0;
    queue.current = [];
  }, []);

  return { slides, isGenerating, feedTranscript, flush, reset };
}
