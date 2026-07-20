import { useCallback, useEffect, useRef } from "react";
import { useSpeech } from "./useSpeech";
import { analyzeVoiceResponse } from "../utils/voiceAnalytics";
import type { VoiceAnalytics } from "../types/voice";

// How long the transcript can sit unchanged while listening before we treat the founder as done
// speaking and auto-submit — long enough to survive a natural mid-sentence breath, short enough to
// still feel instant once they've actually finished
const SILENCE_MS = 2200;

// Wraps the response-phase's own isolated speech instance with silence detection: once the live
// transcript stops changing for SILENCE_MS, the answer is analyzed and handed to `onSilenceFinalize`
// automatically, same as if the founder had tapped the mic to stop. The 60s response-window timeout
// is owned by the caller (ResponseTimer), which reads out via `stopNow` instead.
export function useVoiceResponse(onSilenceFinalize: (transcript: string, analytics: VoiceAnalytics) => void) {
  const speech = useSpeech();
  const startedAtRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<number | null>(null);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  };

  // Builds analytics for whatever transcript text exists right now, using elapsed time since `start`
  const buildAnalytics = useCallback((): { text: string; analytics: VoiceAnalytics } => {
    const text = speech.transcript.trim();
    const durationSeconds = startedAtRef.current ? Math.max(1, (Date.now() - startedAtRef.current) / 1000) : 1;
    return { text, analytics: analyzeVoiceResponse(text, durationSeconds) };
  }, [speech.transcript]);

  // Re-arms the silence timer every time new transcript text arrives while actively listening
  useEffect(() => {
    if (!speech.isListening) return;
    clearSilenceTimer();
    if (speech.transcript.trim()) {
      silenceTimerRef.current = window.setTimeout(() => {
        const { text, analytics } = buildAnalytics();
        speech.stop();
        if (text) onSilenceFinalize(text, analytics);
      }, SILENCE_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speech.transcript, speech.isListening]);

  useEffect(() => () => clearSilenceTimer(), []);

  const start = useCallback(() => {
    startedAtRef.current = Date.now();
    speech.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stops listening without submitting — used when the founder switches away from voice mode
  const cancel = useCallback(() => {
    clearSilenceTimer();
    speech.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stops listening and hands back whatever transcript + analytics exist so far, for the caller to
  // submit itself — used for both a manual mic-tap stop and the 60s response-window timeout
  const stopNow = useCallback(() => {
    clearSilenceTimer();
    const result = buildAnalytics();
    speech.stop();
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildAnalytics]);

  return { transcript: speech.transcript, isListening: speech.isListening, start, cancel, stopNow };
}
