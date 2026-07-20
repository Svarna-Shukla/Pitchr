import { speakDeep } from "./voicePicker";

// Tai Lung's dedicated fallback delivery when ElevenLabs is unavailable: noticeably deeper and
// slower than every other investor's shared voice.speak() in useSpeechSynthesis (pitch 0.5/rate
// 0.75), reusing the same underlying voice-picking primitive so both stay in sync with whatever
// deep voice the browser actually has available.
const TAI_LUNG_FALLBACK_PITCH = 0.45;
const TAI_LUNG_FALLBACK_RATE = 0.82;

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Keeps a handle on whatever Tai Lung line is currently playing so a new line cuts off the last
// one instead of overlapping it, mirroring speakDeep's own cancel-before-speak behavior
let currentAudio: HTMLAudioElement | null = null;

// Mirrors fetchGroqJSON's warnedMissingKey pattern in ../lib/groq.ts — warns once per session
// instead of spamming the console on every line Tai Lung speaks
let warnedMissingKeys = false;

// Requests a Tai Lung line from ElevenLabs and plays it immediately as a Blob URL. Returns false
// (never throws) on any missing config or request failure so the caller can fall back cleanly.
async function speakWithElevenLabs(text: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    if (!warnedMissingKeys) {
      console.warn(
        "[taiLungVoice] VITE_ELEVENLABS_API_KEY/VITE_ELEVENLABS_VOICE_ID not set — falling back to speechSynthesis. " +
          "Set these in your Vercel project's Environment Variables (not just .env) for the cloned voice in production."
      );
      warnedMissingKeys = true;
    }
    return false;
  }

  try {
    const res = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.3, similarity_boost: 0.85, style: 0.6 },
      }),
    });
    if (!res.ok) {
      console.warn(`[taiLungVoice] ElevenLabs request failed with status ${res.status}, falling back to speechSynthesis`);
      return false;
    }

    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    currentAudio?.pause();
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
    return true;
  } catch (err) {
    console.warn("[taiLungVoice] ElevenLabs request errored, falling back to speechSynthesis", err);
    return false;
  }
}

// Speaks a line as Tai Lung — used for both his attack questions (Phase 4, on entering the
// "attacking" battle phase) and his judgment reactions, so every line he speaks shares one voice.
// Prefers his cloned ElevenLabs voice; falls back to the browser's deep speechSynthesis voice if
// the API keys aren't configured or the request fails.
export async function speakAsTaiLung(text: string): Promise<void> {
  try {
    const spoke = await speakWithElevenLabs(text);
    if (!spoke) speakDeep(text, { pitch: TAI_LUNG_FALLBACK_PITCH, rate: TAI_LUNG_FALLBACK_RATE });
  } catch (err) {
    console.warn("[taiLungVoice] speakAsTaiLung failed unexpectedly, falling back to speechSynthesis", err);
    speakDeep(text, { pitch: TAI_LUNG_FALLBACK_PITCH, rate: TAI_LUNG_FALLBACK_RATE });
  }
}
