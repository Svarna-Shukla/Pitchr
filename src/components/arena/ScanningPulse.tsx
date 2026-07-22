import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_LINES = ["Reading your pitch...", "Sizing up the angles...", "Sharpening the first question...", "Almost ready for you..."];
const LINE_INTERVAL_MS = 900;

// Phase 2 of the arena: a brief red scan-line sweep across the screen while the investor's first 3
// brutal questions are being generated, before the mask launches its opening attack. Cross-fades
// through a few conversational status lines instead of sitting on one static "Analyzing..." string,
// so the wait reads as the investor actually forming an opinion rather than a spinner.
export default function ScanningPulse() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setLineIndex((i) => (i + 1) % STATUS_LINES.length), LINE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden px-6 text-center">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.55), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          className="font-mono text-sm uppercase tracking-[0.2em] text-red-500"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {STATUS_LINES[lineIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
