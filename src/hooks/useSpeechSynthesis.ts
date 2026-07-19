import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "pitchr:voice-enabled";

// Preferred deep/male voice names, checked in order, before falling back to whatever male-sounding
// voice the browser offers by default
const VOICE_PRIORITY = ["Daniel", "David", "Alex", "Google UK English Male", "Microsoft David", "Arthur"];

// Reads the previously saved voice-feedback preference from localStorage, defaulting to on
function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

// Picks the deepest, darkest-sounding voice available: first by exact-name priority match, then any
// voice whose name suggests a male voice, then just the first English voice, then whatever's first
function pickDeepVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const name of VOICE_PRIORITY) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const male = voices.find((v) => /male/i.test(v.name) && !/female/i.test(v.name));
  if (male) return male;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

// Wraps the browser's Web Speech Synthesis API so the investor can speak short judgment lines aloud,
// deep, slow, and menacing rather than the browser's default high-pitched voice
export function useSpeechSynthesis() {
  const [enabled, setEnabled] = useState(readEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Caches the voice list once loaded — on many browsers getVoices() is empty until onvoiceschanged fires
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
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

  // Speaks a short phrase aloud, deep and slow, cancelling anything already in progress; no-ops if
  // disabled or unsupported
  const speak = useCallback(
    (text: string) => {
      if (!enabled || !text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
      const voice = pickDeepVoice(voices);
      if (voice) utterance.voice = voice;
      utterance.pitch = 0.5;
      utterance.rate = 0.75;
      utterance.volume = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [enabled]
  );

  return { enabled, toggle, speak, isSpeaking };
}
