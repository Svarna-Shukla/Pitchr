import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

type Props = { theme: Theme };

// Fades up the tagline after the headline settles
export default function Subtitle({ theme }: Props) {
  const isDark = theme === "dark";
  return (
    <motion.p
      className="mt-4 text-center text-base"
      style={{ color: isDark ? "var(--color-text-secondary)" : "var(--color-text-secondary-light)" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      Forge your pitch.
    </motion.p>
  );
}
