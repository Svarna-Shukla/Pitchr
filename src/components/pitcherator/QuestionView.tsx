import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import RecordButton from "../RecordButton";
import Transcript from "../Transcript";

type Props = {
  question: string;
  index: number;
  total: number;
  isRecording: boolean;
  liveAnswer: string;
  onToggleRecord: () => void;
  onSubmitText: (text: string) => void;
};

// Shows the current investor question and lets the user answer by voice or by typing
export default function QuestionView({ question, index, total, isRecording, liveAnswer, onToggleRecord, onSubmitText }: Props) {
  const [typed, setTyped] = useState("");

  // Submits the typed answer, if any, and clears the field
  const handleTypedSubmit = () => {
    if (!typed.trim()) return;
    onSubmitText(typed.trim());
    setTyped("");
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-accent)]">
        Question {index + 1} of {total}
      </span>
      <motion.h3 key={question} className="max-w-lg text-2xl font-bold text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {question}
      </motion.h3>
      <RecordButton recording={isRecording} onClick={onToggleRecord} />
      <p className="text-xs text-gray-500">{isRecording ? "Listening… click to stop" : "Click to answer by voice"}</p>
      <Transcript text={liveAnswer} isListening={isRecording} />

      <div className="flex w-full max-w-sm items-center gap-2">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTypedSubmit()}
          placeholder="...or type your answer"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[color:var(--color-accent)]/50"
        />
        <button
          onClick={handleTypedSubmit}
          disabled={!typed.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-accent)]/20 text-[color:var(--color-accent)] transition disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Submit answer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
