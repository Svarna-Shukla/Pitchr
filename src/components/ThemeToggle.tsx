import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

type Props = { theme: Theme; onToggle: () => void };

// Animated sun/moon button that switches the pitch deck between dark and light themes
export default function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition ${
        isDark ? "bg-white/10 text-yellow-300 hover:bg-white/20" : "bg-black/5 text-orange-500 hover:bg-black/10"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
