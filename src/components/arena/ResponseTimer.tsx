import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = { onTimeout: () => void };

const RESPONSE_WINDOW_SECONDS = 60;

// 60-second countdown strip for the founder's response window; calls onTimeout exactly once if the
// clock runs out before an answer is submitted
export default function ResponseTimer({ onTimeout }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(RESPONSE_WINDOW_SECONDS);
  const firedTimeout = useRef(false);

  // Ticks the countdown down once per second and fires the timeout callback exactly once at zero
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          if (!firedTimeout.current) {
            firedTimeout.current = true;
            onTimeout();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barColor = secondsLeft <= 10 ? "#f87171" : secondsLeft <= 25 ? "#f0a020" : "#38bdf8";

  return (
    <div className="w-full max-w-md">
      {secondsLeft <= 10 && (
        <motion.p
          className="mb-1 text-center text-[11px] font-semibold uppercase tracking-widest text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          A few more seconds — wrap it up
        </motion.p>
      )}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-1 rounded-full"
          style={{ background: barColor }}
          animate={{ width: `${(secondsLeft / RESPONSE_WINDOW_SECONDS) * 100}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>
    </div>
  );
}
