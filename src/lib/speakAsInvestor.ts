import { NATURAL_DEFAULT_VOICE, speakDeep } from "./voicePicker";
import type { FallbackVoice } from "../types/investor";

// Lets callers (e.g. the arena's mic-gating logic) know exactly when the investor's voice actually
// starts/stops playing, regardless of which delivery path (ElevenLabs audio vs. browser
// speechSynthesis) ends up firing. Exactly one path calls these per invocation — see speakAsInvestor.
export type SpeakCallbacks = { onStart?: () => void; onEnd?: () => void };

// Used when ElevenLabs is unavailable and the caller hasn't supplied this investor's own
// pitch/rate (see PersonalityConfig.fallbackVoice) — a neutral, natural delivery rather than a
// generic screen-reader voice.
const DEFAULT_FALLBACK_VOICE: FallbackVoice = NATURAL_DEFAULT_VOICE;

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Caps how long we wait on the ElevenLabs request before giving up and falling back — without this,
// a stalled/blocked network leaves the request pending forever instead of ever reaching the fallback
const REQUEST_TIMEOUT_MS = 8000;

// Keeps a handle on whatever line is currently playing so a new line cuts off the last one instead
// of overlapping it, mirroring speakDeep's own cancel-before-speak behavior
let currentAudio: HTMLAudioElement | null = null;

// Warns once per session instead of spamming the console on every line spoken with no key configured
let warnedMissingKey = false;

// Reads the ElevenLabs API key from whichever env system is actually live — this project runs on
// Vite (import.meta.env.VITE_*), but also checks process.env.NEXT_PUBLIC_* so the same lookup works
// unchanged if this ever ships behind Next.js instead.
function readApiKey(): string {
  const viteKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (viteKey) return viteKey;
  const nextKey = typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_ELEVENLABS_API_KEY : undefined;
  return nextKey ?? "";
}

// Requests a line from ElevenLabs in the given investor's voice and plays it immediately as a Blob
// URL. Returns false (never throws) on any missing config or request failure so the caller can fall
// back cleanly to window.speechSynthesis.
async function speakWithElevenLabs(text: string, voiceId: string, callbacks?: SpeakCallbacks): Promise<boolean> {
  const apiKey = readApiKey();
  if (!apiKey || !voiceId) {
    if (!warnedMissingKey) {
      console.error(
        "[speakAsInvestor] Missing ElevenLabs API key or a voice ID for this investor — falling back to window.speechSynthesis. " +
          "Set VITE_ELEVENLABS_API_KEY (or NEXT_PUBLIC_ELEVENLABS_API_KEY) and the per-investor NEXT_PUBLIC_VOICE_*/VITE_VOICE_* variables in your Vercel project's Environment Variables (not just .env) for cloned voices in production."
      );
      warnedMissingKey = true;
    }
    return false;
  }

  const timeoutController = new AbortController();
  const timeout = window.setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);
  try {
    const trimmedText = text.trim() || "...";
    const res = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: trimmedText,
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
      signal: timeoutController.signal,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error(`[speakAsInvestor] ElevenLabs request failed with status ${res.status} for voice ${voiceId}:`, errBody);
      return false;
    }

    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    currentAudio?.pause();
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      callbacks?.onEnd?.();
    };
    // Fired right before playback is requested (not awaited, see below) so mic-gating callers mute
    // synchronously rather than racing the browser's own playback start.
    callbacks?.onStart?.();
    // Deliberately not awaited: audio.play()'s returned promise only resolves once playback has
    // started, and can hang indefinitely under some autoplay/media-engagement policies. We already
    // have valid audio bytes at this point, so that's success — start playback and move on rather
    // than blocking the caller (and the UI) on it. If it's rejected outright (e.g. blocked by an
    // autoplay policy), onEnd still fires here so a caller gating on isAISpeaking never gets stuck
    // muted waiting for an "ended" event that will now never come.
    audio.play().catch((err) => {
      console.error("[speakAsInvestor] Audio playback failed to start", err);
      callbacks?.onEnd?.();
    });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`[speakAsInvestor] ElevenLabs request timed out after ${REQUEST_TIMEOUT_MS}ms, falling back to speechSynthesis`);
    } else {
      console.error("[speakAsInvestor] ElevenLabs request errored, falling back to speechSynthesis", err);
    }
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

// Speaks a line aloud as whichever investor is currently active, in that investor's own cloned
// ElevenLabs voice — used for attack questions, judgment reactions, and the preview modal's voice
// sample alike. Falls back to the browser's speechSynthesis voice (in this investor's own
// pitch/rate, or a neutral default if none was given) if the API key or this investor's voice ID
// isn't configured, or if the ElevenLabs request fails.
export async function speakAsInvestor(
  text: string,
  voiceId?: string,
  fallbackVoice?: FallbackVoice,
  callbacks?: SpeakCallbacks
): Promise<void> {
  const delivery = fallbackVoice ?? DEFAULT_FALLBACK_VOICE;
  try {
    const spoke = await speakWithElevenLabs(text, voiceId ?? "", callbacks);
    if (!spoke) speakDeep(text, { ...delivery, onStart: callbacks?.onStart, onEnd: callbacks?.onEnd });
  } catch (err) {
    console.error("[speakAsInvestor] speakAsInvestor failed unexpectedly, falling back to speechSynthesis", err);
    speakDeep(text, { ...delivery, onStart: callbacks?.onStart, onEnd: callbacks?.onEnd });
  }
}

// Immediately halts whatever investor line is currently playing — either the ElevenLabs audio or the
// browser speechSynthesis fallback. Used to hard-cut a mid-line investor voice the instant the arena
// needs it silenced, e.g. the session ending in game over.
export function stopInvestorVoice(): void {
  currentAudio?.pause();
  currentAudio = null;
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}

// Engine-aware variant used by the Arena header's "HD Voice / Fast Voice" toggle. "fast" never
// touches the network — it goes straight to window.speechSynthesis so no ElevenLabs characters are
// ever burned, which matters most in "The Ultimate Tank" where 5 investors can each speak every round.
export async function speakInvestorLine(
  text: string,
  voiceId: string | undefined,
  engine: "hd" | "fast",
  fallbackVoice?: FallbackVoice,
  callbacks?: SpeakCallbacks
): Promise<void> {
  if (engine === "fast") {
    speakDeep(text, { ...(fallbackVoice ?? DEFAULT_FALLBACK_VOICE), onStart: callbacks?.onStart, onEnd: callbacks?.onEnd });
    return;
  }
  return speakAsInvestor(text, voiceId, fallbackVoice, callbacks);
}
