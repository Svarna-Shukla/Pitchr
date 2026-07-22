import { motion, AnimatePresence } from "framer-motion";

type Props = { active: boolean; wide?: boolean };

const RING_COUNT = 3;

// Warm "the investor is actively listening" signal wrapped around the mask: a soft breathing glow
// plus concentric rings expanding outward on a staggered loop, replacing the old static box-shadow
// with something that visibly pulses in time — the founder should feel heard the instant they start
// talking, not just see a passive tint.
export default function ListeningPulseRings({ active, wide = false }: Props) {
  const dim = wide ? "h-[70%] w-[85%] max-w-[900px]" : "h-[70%] w-[70%] max-w-[520px]";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`pointer-events-none absolute ${dim} rounded-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 90px 30px rgba(56,189,248,0.18), inset 0 0 60px 10px rgba(56,189,248,0.12)" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border border-sky-400/40"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.08, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
