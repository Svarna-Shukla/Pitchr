import { motion } from "framer-motion";
import RecordButton from "../RecordButton";
import Transcript from "../Transcript";

type Props = {
  question: string;
  index: number;
  total: number;
  isRecording: boolean;
  liveAnswer: string;
  onToggleRecord: () => void;
};

// Shows the current investor question and lets the user record their spoken answer
export default function QuestionView({ question, index, total, isRecording, liveAnswer, onToggleRecord }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
        Question {index + 1} of {total}
      </span>
      <motion.h3
        key={question}
        className="max-w-lg text-2xl font-bold text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {question}
      </motion.h3>
      <RecordButton recording={isRecording} onClick={onToggleRecord} />
      <p className="text-xs text-gray-500">{isRecording ? "Listening… click to stop" : "Click to answer"}</p>
      <Transcript text={liveAnswer} isListening={isRecording} />
    </div>
  );
}
