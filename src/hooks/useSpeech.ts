import { useCallback, useEffect, useRef, useState } from "react";

// Wraps the Web Speech API to capture live voice and build a running transcript. Most mobile
// browsers other than Chrome on Android don't implement SpeechRecognition at all, so callers must
// check `supported` and keep a text-input fallback visible regardless.
export function useSpeech() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text.trim());
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  // Starts the browser speech recogniser and clears the previous transcript
  const start = useCallback(() => {
    setTranscript("");
    recognitionRef.current?.start();
    setIsListening(true);
  }, []);

  // Stops the browser speech recogniser
  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { transcript, isListening, start, stop, supported };
}