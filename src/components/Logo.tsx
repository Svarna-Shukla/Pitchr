import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

type Props = { theme?: Theme };

// Fades in the Pitchr wordmark with the target-and-arrow mark on page load. Text color is driven explicitly by
// the active theme (not the dark-mode-only CSS variable) so it stays legible against a white light-mode navbar.
export default function Logo({ theme = "dark" }: Props) {
  const isDark = theme === "dark";
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <img src="/branding/pitchr-logo.png" alt="" className="h-6 w-6" />
      <h1 className="font-display text-xl font-semibold tracking-tight" style={{ color: isDark ? "#ffffff" : "#111111" }}>
        Pitchr
      </h1>
    </motion.div>
  );
}
