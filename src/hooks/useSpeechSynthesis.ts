import { useCallback, useEffect, useState } from "react";
import { speakDeep } from "../lib/voicePicker";

const STORAGE_KEY = "pitchr:voice-enabled";

// Reads the previously saved voice-feedback preference from localStorage, defaulting to on
function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

// Wraps the browser's Web Speech Synthesis API so the investor can speak short judgment lines aloud,
// deep, slow, and menacing rather than the browser's default high-pitched voice. Voice picking and
// the actual SpeechSynthesisUtterance mechanics live in lib/voicePicker.ts, shared with Tai Lung's
// dedicated deeper delivery in lib/taiLungVoice.ts.
export function useSpeechSynthesis() {
  const [enabled, setEnabled] = useState(readEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Many browsers' getVoices() returns empty until onvoiceschanged fires once — this just warms the
  // browser's own internal voice list before the first real speak() call needs it
  useEffect(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Flips voice feedback on/off and persists the choice
  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // Storage unavailable — preference still switches for this session
      }
      if (!next) window.speechSynthesis?.cancel();
      return next;
    });
  }, []);

  // Speaks a short phrase aloud, deep and slow; no-ops if disabled
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;
      speakDeep(text, { pitch: 0.5, rate: 0.75, onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });
    },
    [enabled]
  );

  return { enabled, toggle, speak, isSpeaking };
}
