import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { usePitcherator } from "../../hooks/usePitcherator";
import { useSpeech } from "../../hooks/useSpeech";
import QuestionView from "./QuestionView";
import ScorecardCard from "./ScorecardCard";

type Props = {
  pitcherator: ReturnType<typeof usePitcherator>;
  onClose: () => void;
  onGenerateImprovedDeck: () => void;
};

// Full-screen modal that walks the user through Pitcherator's questions and final scorecard.
// Uses its own isolated speech instance so answering questions never overwrites the main pitch transcript.
export default function PitcheratorOverlay({ pitcherator, onClose, onGenerateImprovedDeck }: Props) {
  const speech = useSpeech();
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

      <div style={{ perspective: "1200px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={failed ? "failed" : stage}
            initial={{ opacity: 0, rotateX: -14, y: 12 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          >
            {failed && <p className="text-sm text-red-400">Something went wrong generating that — try again.</p>}

            {!failed && stage === "asking" && (
              <QuestionView
                question={questions[currentQuestionIndex]}
                index={currentQuestionIndex}
                total={questions.length}
                isRecording={speech.isListening}
                liveAnswer={speech.transcript}
                onToggleRecord={handleToggleRecord}
                onSubmitText={pitcherator.submitAnswer}
              />
            )}

            {!failed && stage === "generating-scorecard" && <p className="text-sm text-white/60">Scoring your pitch…</p>}

            {!failed && stage === "scorecard" && scorecard && (
              <ScorecardCard scorecard={scorecard} onGenerateImprovedDeck={onGenerateImprovedDeck} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
