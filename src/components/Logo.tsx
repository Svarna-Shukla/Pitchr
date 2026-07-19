import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

type Props = { theme?: Theme };

// Fades in the Pitchr wordmark with a flame icon on page load. Text color is driven explicitly by the
// active theme (not the dark-mode-only CSS variable) so it stays legible against a white light-mode navbar.
export default function Logo({ theme = "dark" }: Props) {
  const isDark = theme === "dark";
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flame className="h-5 w-5 text-[color:var(--color-accent)]" />
      <h1 className="font-display text-xl font-semibold tracking-tight" style={{ color: isDark ? "#ffffff" : "#111111" }}>
        Pitchr
      </h1>
    </motion.div>
  );
}
