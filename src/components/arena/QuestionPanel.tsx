import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = { question: string; onTypedComplete: () => void };

const LETTER_INTERVAL_MS = 16;

// The investor's question, typed out letter by letter directly below the mask — as if it's being
// spoken at you. Each new question slides in from below while the previous one slides up and fades
// out (keyed by question text so AnimatePresence treats it as a swap). Large, centered, readable
// white text over a blurred dark backdrop panel. The round number itself lives in the fixed
// <RoundCounter> HUD, not here.
export default function QuestionPanel({ question, onTypedComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  // Advances the visible letter count on a fixed interval, then signals completion exactly once
  useEffect(() => {
    setVisibleCount(0);
    const id = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= question.length) {
          window.clearInterval(id);
          onTypedComplete();
          return count;
        }
        return count + 1;
      });
    }, LETTER_INTERVAL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  return (
    <div className="flex w-full flex-col items-center gap-3 px-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          className="max-w-[600px] rounded-2xl bg-black/40 px-6 py-5 backdrop-blur-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <p className="text-lg font-bold leading-snug text-white sm:text-2xl md:text-3xl">
            {question.slice(0, visibleCount)}
            <span className="text-orange-400">{visibleCount < question.length ? "▌" : ""}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
