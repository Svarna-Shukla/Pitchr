import { motion } from "framer-motion";

type Props = { bullets: string[]; dotClass: string };

// Renders bullet points that fade in one by one with a colour-coded dot
export default function SlideBullets({ bullets, dotClass }: Props) {
  return (
    <ul className="mt-4 space-y-3">
      {bullets.map((b, i) => (
        <motion.li
          key={i}
          className="flex items-start gap-3 text-sm text-white/75 leading-relaxed"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.15 }}
        >
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
          {b}
        </motion.li>
      ))}
    </ul>
  );
}
