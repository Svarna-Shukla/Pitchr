import { motion } from "framer-motion";

type Props = { text: string; isListening: boolean };

// Live streaming transcript for the voice-first response surface: words fade in one at a time as
// speech recognition results arrive, with a blinking neon-blue caret while still listening
export default function LiveTranscriptStream({ text, isListening }: Props) {
  const words = text ? text.split(/\s+/) : [];
  if (!words.length && !isListening) return null;

  return (
    <motion.div
      className="max-h-40 w-full max-w-md overflow-y-auto rounded-xl border border-[#38bdf8]/20 bg-[#0c1b2a]/60 p-4 text-center text-sm leading-relaxed text-[#7dd3fc]"
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
          className="ml-1 inline-block text-[#38bdf8]"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
}
