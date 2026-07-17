import { motion } from "framer-motion";
import Headline from "../Headline";
import Subtitle from "../Subtitle";
import RecordButton from "../RecordButton";
import Waveform from "../Waveform";
import Transcript from "../Transcript";
import PitcheratorButton from "../pitcherator/PitcheratorButton";

type Props = {
  isListening: boolean;
  onToggleRecord: () => void;
  transcript: string;
  audioLevels: number[];
  finished: boolean;
  isGenerating: boolean;
  canPitcherate: boolean;
  onPitcherator: () => void;
};

// Left column: headline, record controls, live waveform, and the transcript
export default function LeftColumn({
  isListening,
  onToggleRecord,
  transcript,
  audioLevels,
  finished,
  isGenerating,
  canPitcherate,
  onPitcherator,
}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-24">
      <Headline />
      <Subtitle />
      <div className="mt-12 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <RecordButton recording={isListening} onClick={onToggleRecord} />
          <PitcheratorButton disabled={!canPitcherate} onClick={onPitcherator} />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {isListening ? "Listening… click to stop" : "Click to start speaking"}
        </p>
        <Waveform levels={audioLevels} active={isListening} />
        <Transcript text={transcript} isListening={isListening} />
        {finished && !isListening && (
          <motion.p className="mt-6 text-lg font-semibold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Your pitch deck is ready{isGenerating ? "…" : ""}
          </motion.p>
        )}
      </div>
    </div>
  );
}
