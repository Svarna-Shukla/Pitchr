import { motion } from "framer-motion";
import { Flame } from "lucide-react";

// Fades in the Pitchr wordmark with a flame icon on page load
export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flame className="h-5 w-5 text-[color:var(--color-accent)]" />
      <h1 className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">Pitchr</h1>
    </motion.div>
  );
}
