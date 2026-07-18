import { useCallback, useRef, useState } from "react";

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
export function useSpeechSynthesis() {
  const [enabled, setEnabled] = useState(readEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // Speaks a short phrase aloud, cancelling anything already in progress; no-ops if disabled or unsupported
  const speak = useCallback(
    (text: string) => {
      if (!enabled || !text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [enabled]
  );

  return { enabled, toggle, speak, isSpeaking };
}
