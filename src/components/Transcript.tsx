import { motion } from "framer-motion";

type Props = { text: string; isListening: boolean };

// Displays the live speech transcript, word by word, inside a bordered scrollable box
export default function Transcript({ text, isListening }: Props) {
  const words = text ? text.split(/\s+/) : [];
  if (!words.length && !isListening) return null;

  return (
    <motion.div
      className="mt-6 max-h-40 w-full max-w-md overflow-y-auto rounded-xl border border-white/10 p-4 text-center text-sm leading-relaxed text-white/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-1 inline-block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {word}
        </motion.span>
      ))}
      {isListening && (
        <motion.span
          className="ml-1 inline-block text-red-400"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
}
