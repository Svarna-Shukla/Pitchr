import { useState } from "react";
import { motion } from "framer-motion";
import HexMicButton from "./HexMicButton";
import Transcript from "../Transcript";
import Waveform from "../Waveform";
import VoiceSupportBanner from "./VoiceSupportBanner";

type Props = {
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  speechSupported: boolean;
  onToggleRecord: () => void;
  onSubmitPitch: (text: string) => void;
};

// Phase 1 of the arena: "Step Into the Arena" — capture the founder's pitch by voice or typed text
// while the mask looms above, before the interrogation begins. Rendered as the bottom-slot content
// beneath MaskStage, which handles the mask itself. The typed textarea is always visible and usable,
// independent of whether voice input is supported on this browser.
export default function PitchIntake({ isListening, transcript, audioLevels, speechSupported, onToggleRecord, onSubmitPitch }: Props) {
  const [typed, setTyped] = useState("");
  const pitchText = transcript.trim() || typed.trim();
  const canEnter = !isListening && pitchText.length > 0;

  // Submits whichever pitch text is available — spoken transcript takes priority over typed text
  const handleEnter = () => {
    if (canEnter) onSubmitPitch(pitchText);
  };

  return (
    <motion.div
      className="flex w-full max-w-lg flex-col items-center gap-5 px-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-3xl font-bold text-white">Step Into the Arena</h2>
      <p className="text-sm text-white/50">Pitch your idea. The investor is waiting to grill you on it.</p>

      <VoiceSupportBanner supported={speechSupported} />
      <HexMicButton recording={isListening} onClick={onToggleRecord} />
      <Waveform levels={audioLevels} active={isListening} />
      <Transcript text={transcript} isListening={isListening} />

      <textarea
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="...or type your pitch instead"
        rows={3}
        className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
      />

      <button
        onClick={handleEnter}
        disabled={!canEnter}
        className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Enter the Arena
      </button>
    </motion.div>
  );
}
