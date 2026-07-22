import { useCallback, useEffect, useState } from "react";
import { NATURAL_DEFAULT_VOICE, speakDeep } from "../lib/voicePicker";

const STORAGE_KEY = "pitchr:voice-enabled";

// Reads the previously saved voice-feedback preference from localStorage, defaulting to on
function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

// Wraps the browser's Web Speech Synthesis API so the investor can speak short judgment lines aloud
// through the most natural voice available, rather than the browser's flat default. Voice picking
// and the actual SpeechSynthesisUtterance mechanics live in lib/voicePicker.ts, shared with every
// investor's ElevenLabs fallback delivery in lib/speakAsInvestor.ts.
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

  // Speaks a short phrase aloud in a natural, unhurried delivery; no-ops if disabled
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;
      speakDeep(text, { ...NATURAL_DEFAULT_VOICE, onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });
    },
    [enabled]
  );

  return { enabled, toggle, speak, isSpeaking };
}
