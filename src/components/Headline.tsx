import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

const WORDS = "Speak your idea. Watch your pitch build itself.".split(" ");

// headline layout

type Props = { theme: Theme };

// Reveals each word of the headline one at a time with a fade-up
export default function Headline({ theme }: Props) {
  const isDark = theme === "dark";
  return (
    <h2
      className={`max-w-3xl text-center text-4xl font-bold leading-tight md:text-5xl ${
        isDark ? "text-white" : "text-[#111111]"
      }`}
    >
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.3em] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}
