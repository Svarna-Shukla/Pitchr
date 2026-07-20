import { motion } from "framer-motion";
import { capBullets } from "../lib/text";
import { BULLET_CLASS } from "./deck/premium/layouts/typeScale";

type Props = { bullets: string[]; color: string; textColor: string; marker?: "square" | "dash"; animate?: boolean };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const item = {
  hidden: { opacity: 0, x: -24, rotateY: -20 },
  show: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// Renders up to MAX_BULLETS short bullet points, each sliding in from the left with a slight 3D
// tilt, staggered one after another — the deck's one shared bullet-list renderer across layouts.
// `animate` defaults to true but is forced off for PDF export: a capture taken mid-stagger would
// show bullets partway through their fade/rotate-in, so PDF renders mount already in the "show" state.
export default function SlideBullets({ bullets, color, textColor, marker = "square", animate = true }: Props) {
  const shown = capBullets(bullets);

  return (
    <motion.ul
      className={`mt-6 space-y-4 ${BULLET_CLASS}`}
      style={{ color: textColor }}
      variants={container}
      initial={animate ? "hidden" : "show"}
      animate="show"
    >
      {shown.map((b, i) => (
        <motion.li key={i} className="flex items-start gap-3" variants={item} style={{ transformStyle: animate ? "preserve-3d" : undefined }}>
          {marker === "square" ? (
            <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: color }} />
          ) : (
            <span className="font-bold" style={{ color }}>
              —
            </span>
          )}
          <span data-fit-bullet>{b}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
