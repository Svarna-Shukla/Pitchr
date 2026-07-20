import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResponseTimer from "./ResponseTimer";
import VoiceSupportBanner from "./VoiceSupportBanner";
import VoiceResponseInput from "./voice/VoiceResponseInput";
import TypedResponseInput from "./voice/TypedResponseInput";
import ResponseModeToggle from "./voice/ResponseModeToggle";
import { useVoiceResponse } from "../../hooks/useVoiceResponse";
import { isSpeechRecognitionSupported } from "../../hooks/useSpeech";
import type { VoiceAnalytics } from "../../types/voice";

type Props = { visible: boolean; onSubmitAnswer: (text: string, isTimeout?: boolean, voiceAnalytics?: VoiceAnalytics) => void };

const speechSupported = isSpeechRecognitionSupported();

// The bottom response bar: a countdown strip, then the founder's response surface — voice-first by
// default (pulsing mic + live waveform + streaming transcript, auto-submitting on silence), with a
// discrete toggle down to a typed fallback. Either mode auto-submits on the 60s countdown. Owns its
// own isolated speech instance per round so it never clobbers the original pitch transcript.
export default function ResponseControls({ visible, onSubmitAnswer }: Props) {
  const [mode, setMode] = useState<"voice" | "type">(speechSupported ? "voice" : "type");
  const [typed, setTyped] = useState("");
  const voice = useVoiceResponse((text, analytics) => onSubmitAnswer(text, false, analytics));

  // Voice-first: starts listening automatically once the question is done typing out; stops if the
  // founder switches to typed mode or the response phase ends; cancels on unmount too
  useEffect(() => {
    if (visible && mode === "voice" && speechSupported) voice.start();
    else if (voice.isListening) voice.cancel();
    return () => voice.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, mode]);

  const handleTypedSubmit = () => {
    if (!typed.trim()) return;
    onSubmitAnswer(typed.trim());
  };

  const handleTimeout = () => {
    if (mode === "voice" && voice.isListening) {
      const { text, analytics } = voice.stopNow();
      onSubmitAnswer(text || typed.trim(), true, text ? analytics : undefined);
    } else {
      onSubmitAnswer(typed.trim(), true);
    }
  };

  // Manual mic tap while recording: stops and submits immediately, same as silence detection but
  // founder-initiated rather than a timeout
  const handleManualStop = () => {
    const { text, analytics } = voice.stopNow();
    if (text) onSubmitAnswer(text, false, analytics);
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[64] flex w-full flex-col items-center gap-3 bg-[#0a0a0a]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:static md:bg-transparent md:px-6 md:pb-6 md:pt-0 md:backdrop-blur-none"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {visible && <ResponseTimer onTimeout={handleTimeout} />}
      <VoiceSupportBanner supported={speechSupported} />
      {speechSupported && <ResponseModeToggle mode={mode} onToggle={() => setMode((m) => (m === "voice" ? "type" : "voice"))} />}
      {mode === "voice" && speechSupported ? (
        <VoiceResponseInput transcript={voice.transcript} isListening={voice.isListening} onToggleMic={() => (voice.isListening ? handleManualStop() : voice.start())} />
      ) : (
        <TypedResponseInput value={typed} onChange={setTyped} onSubmit={handleTypedSubmit} />
      )}
    </motion.div>
  );
}
