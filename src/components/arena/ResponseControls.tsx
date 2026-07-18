import { useState } from "react";
import { Send } from "lucide-react";
import RecordButton from "../RecordButton";
import Transcript from "../Transcript";
import { useSpeech } from "../../hooks/useSpeech";
import ResponseTimer from "./ResponseTimer";

type Props = { onSubmitAnswer: (text: string) => void };

// Phase 4 of the arena: lets the founder answer the current attack by voice or typed text, under a
// 60-second countdown. Owns its own isolated speech instance so it never clobbers the original pitch transcript.
export default function ResponseControls({ onSubmitAnswer }: Props) {
  const speech = useSpeech();
  const [typed, setTyped] = useState("");

  // Stopping the mic submits whatever was transcribed immediately, mirroring a real spoken answer
  const handleToggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      onSubmitAnswer(speech.transcript);
    } else {
      speech.start();
    }
  };

  // Submits the typed answer, if any
  const handleTypedSubmit = () => {
    if (!typed.trim()) return;
    onSubmitAnswer(typed.trim());
  };

  // If the 60s window runs out, submit whatever answer text is currently available
  const handleTimeout = () => {
    const text = typed.trim() || speech.transcript.trim();
    if (speech.isListening) speech.stop();
    onSubmitAnswer(text);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponseTimer onTimeout={handleTimeout} />
      <RecordButton recording={speech.isListening} onClick={handleToggleRecord} />
      <Transcript text={speech.transcript} isListening={speech.isListening} />

      <div className="flex w-full max-w-sm items-center gap-2">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTypedSubmit()}
          placeholder="...or type your defense"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400/50"
        />
        <button
          onClick={handleTypedSubmit}
          disabled={!typed.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 text-sky-400 transition disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Submit answer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
