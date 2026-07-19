import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import HexMicButton from "./HexMicButton";
import Transcript from "../Transcript";
import { useSpeech } from "../../hooks/useSpeech";
import ResponseTimer from "./ResponseTimer";
import VoiceSupportBanner from "./VoiceSupportBanner";

type Props = { visible: boolean; onSubmitAnswer: (text: string, isTimeout?: boolean) => void };

// The bottom response bar: a countdown strip, the hexagonal mic button, and a text field to
// "...defend yourself". Owns its own isolated speech instance so it never clobbers the original pitch
// transcript. Only fades in once the investor's question has finished typing out above. Fixed to the
// bottom of the screen on mobile so it's always reachable without scrolling.
export default function ResponseControls({ visible, onSubmitAnswer }: Props) {
  const speech = useSpeech();
  const [typed, setTyped] = useState("");

  // Mirrors the live voice transcript into the same controlled state the textarea uses, so the
  // send button's `disabled={!typed.trim()}` check reacts to speech exactly like typing would
  useEffect(() => {
    if (speech.transcript) setTyped(speech.transcript);
  }, [speech.transcript]);

  // Stopping the mic just stops listening — the transcribed text is already sitting in the
  // textarea (mirrored above) for the founder to review, edit, or send
  const handleToggleRecord = () => {
    if (speech.isListening) speech.stop();
    else speech.start();
  };

  // Submits the typed answer, ignoring empty submissions
  const handleTypedSubmit = () => {
    if (!typed.trim()) return;
    onSubmitAnswer(typed.trim());
  };

  // If the 60s window runs out, submit whatever answer text is currently available as a timeout
  const handleTimeout = () => {
    const text = typed.trim() || speech.transcript.trim();
    if (speech.isListening) speech.stop();
    onSubmitAnswer(text, true);
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
      <VoiceSupportBanner supported={speech.supported} />
      <Transcript text={speech.transcript} isListening={speech.isListening} />
      <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 sm:contents">
          <HexMicButton recording={speech.isListening} onClick={handleToggleRecord} size={56} />
          <textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTypedSubmit();
              }
            }}
            placeholder="...defend yourself"
            rows={2}
            className="min-h-[120px] w-full flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 sm:min-h-0 sm:rounded-full sm:py-3"
          />
        </div>
        <button
          onClick={handleTypedSubmit}
          disabled={!typed.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full bg-white/10 text-white transition disabled:cursor-not-allowed disabled:opacity-30 sm:self-auto"
          aria-label="Submit answer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
