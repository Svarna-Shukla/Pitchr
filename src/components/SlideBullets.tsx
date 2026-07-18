import { motion } from "framer-motion";
import { capBullets } from "../lib/text";

type Props = { bullets: string[]; color: string; textClass: string };

// Renders up to 3 short bullet points with a small coloured square marker, fading in one by one
export default function SlideBullets({ bullets, color, textClass }: Props) {
  const shown = capBullets(bullets);

  return (
    <ul className="mt-6 space-y-3">
      {shown.map((b, i) => (
        <motion.li
          key={i}
          className={`flex items-start gap-3 text-[16px] leading-relaxed ${textClass}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.12 }}
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px]" style={{ background: color }} />
          {b}
        </motion.li>
      ))}
    </ul>
  );
}


// displays the bullet points of the slides
