import { motion } from "framer-motion";

// Brief loading beat between the founder's pitch input and the investor's first question, while
// the 3 brutal questions are generated
export default function ScanningPulse() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <motion.div
        className="h-24 w-24 rounded-full"
        style={{ background: "radial-gradient(circle, #f97316aa, transparent 70%)" }}
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">Analyzing your pitch…</p>
    </div>
  );
}
