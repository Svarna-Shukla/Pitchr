import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { usePitcherator } from "../../hooks/usePitcherator";
import QuestionView from "./QuestionView";
import ScorecardCard from "./ScorecardCard";

type Speech = { transcript: string; isListening: boolean; start: () => void; stop: () => void };

type Props = {
  pitcherator: ReturnType<typeof usePitcherator>;
  speech: Speech;
  onClose: () => void;
};

// Full-screen modal that walks the user through Pitcherator's questions and final scorecard
export default function PitcheratorOverlay({ pitcherator, speech, onClose }: Props) {
  const { stage, questions, currentQuestionIndex, scorecard, failed } = pitcherator;

  // Toggles recording for the current question, submitting the answer once the user stops
  const handleToggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      pitcherator.submitAnswer(speech.transcript);
    } else {
      speech.start();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white" aria-label="Close">
        <X className="h-6 w-6" />
      </button>

      {failed && <p className="text-sm text-red-400">Something went wrong generating that — try again.</p>}

      {!failed && stage === "asking" && (
        <QuestionView
          question={questions[currentQuestionIndex]}
          index={currentQuestionIndex}
          total={questions.length}
          isRecording={speech.isListening}
          liveAnswer={speech.transcript}
          onToggleRecord={handleToggleRecord}
        />
      )}

      {!failed && stage === "generating-scorecard" && (
        <p className="text-sm text-white/60">Scoring your pitch…</p>
      )}

      {!failed && stage === "scorecard" && scorecard && <ScorecardCard scorecard={scorecard} />}
    </motion.div>
  );
}
