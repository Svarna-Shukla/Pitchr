import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { StreakEvent } from "../../hooks/useArenaHealth";

type Props = { streakEvent: StreakEvent };

const DISPLAY_MS = 2200;

// Transient "ON FIRE" / "CRITICAL" badge just below the round counter, flashing whenever the streak
// machine fires (3 strong answers in a row, or 3 weak/timeout answers in a row)
export default function StreakBadge({ streakEvent }: Props) {
  const [visible, setVisible] = useState(false);

  // Shows the badge for a couple seconds every time a new streak event comes in
  useEffect(() => {
    if (!streakEvent) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [streakEvent]);

  const isFire = streakEvent?.type === "fire";

  return (
    <div className="flex min-h-[28px] w-full justify-center pt-2">
      <AnimatePresence>
        {visible && streakEvent && (
          <motion.span
            key={streakEvent.key}
            className="rounded-full px-3 py-1 text-sm font-black uppercase tracking-widest"
            style={{ background: isFire ? "rgba(249,115,22,0.2)" : "rgba(220,38,38,0.25)", color: isFire ? "#fb923c" : "#f87171" }}
            initial={{ opacity: 0, scale: 0.8, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {isFire ? "ON FIRE" : "CRITICAL"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
