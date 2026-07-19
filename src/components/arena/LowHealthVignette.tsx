import { AnimatePresence, motion } from "framer-motion";

type Props = { active: boolean };

// Subtle pulsing red vignette hugging the screen edges once the founder's pitch health is critical
// (<=10), a last-ditch visual warning on top of everything else in the arena
export default function LowHealthVignette({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80]"
          style={{ boxShadow: "inset 0 0 160px 40px rgba(220,38,38,0.35)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
