import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

type Props = { theme: Theme };

// Reveals the headline with a single clean line-wipe rather than a per-word stagger
export default function Headline({ theme }: Props) {
  const isDark = theme === "dark";
  return (
    <div className="overflow-hidden">
      <motion.h2
        className={`max-w-2xl text-center font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl ${
          isDark ? "text-[color:var(--color-text-primary)]" : "text-[color:var(--color-text-primary-light)]"
        }`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        Speak your idea. Watch your pitch build itself.
      </motion.h2>
    </div>
  );
}
