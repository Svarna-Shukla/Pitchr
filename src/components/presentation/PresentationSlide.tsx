import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import { TYPE_CONFIG } from "../SlideCard";

type Props = { slide: Slide; direction: number };

const DEFAULT = { border: "border-white/20", badge: "bg-white/10 text-white/60", dot: "bg-white/40" };

// Renders one slide fullscreen for Presentation Mode, sliding in from the given direction
export default function PresentationSlide({ slide, direction }: Props) {
  const cfg = TYPE_CONFIG[slide.type] ?? DEFAULT;

  return (
    <motion.div
      key={slide.title}
      className="flex w-full max-w-4xl flex-col items-center text-center"
      initial={{ opacity: 0, x: direction * 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 80 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <span className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest ${cfg.badge}`}>
        {slide.type}
      </span>
      <h2 className="mt-6 text-5xl font-bold leading-tight text-white">{slide.title}</h2>
      <ul className="mt-10 space-y-4">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-3 text-xl text-white/80">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
