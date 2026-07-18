import { useState } from "react";
import { motion } from "framer-motion";
import RecordButton from "../RecordButton";
import Transcript from "../Transcript";
import Waveform from "../Waveform";
import Button from "../Button";

type Props = {
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  onToggleRecord: () => void;
  onSubmitPitch: (text: string) => void;
};

// Phase 1 of the arena: capture the founder's pitch by voice or typed text before the battle begins
export default function PitchIntake({ isListening, transcript, audioLevels, onToggleRecord, onSubmitPitch }: Props) {
  const [typed, setTyped] = useState("");
  const pitchText = transcript.trim() || typed.trim();
  const canEnter = !isListening && pitchText.length > 0;

  // Kicks off the battle with whichever source of pitch text is available
  const handleEnter = () => {
    if (canEnter) onSubmitPitch(pitchText);
  };

  return (
    <motion.div
      className="flex w-full max-w-lg flex-col items-center gap-5 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-3xl font-bold text-white">Step Into the Arena</h2>
      <p className="text-sm text-white/50">Pitch your idea. The investor is waiting to grill you on it.</p>

      <RecordButton recording={isListening} onClick={onToggleRecord} />
      <Waveform levels={audioLevels} active={isListening} />
      <Transcript text={transcript} isListening={isListening} />

      <textarea
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="...or type your pitch instead"
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-orange-500/50"
      />

      <Button onClick={handleEnter} disabled={!canEnter} className="w-full">
        Enter the Arena
      </Button>
    </motion.div>
  );
}
