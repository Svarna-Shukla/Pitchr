import { motion } from "framer-motion";

const WORDS = "Speak your idea. Watch your pitch build itself.".split(" ");

// Reveals each word of the headline one at a time with a fade-up
export default function Headline() {
  return (
    <h2 className="max-w-3xl text-center text-4xl font-bold leading-tight text-white md:text-5xl">
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.3em] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.12, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}
