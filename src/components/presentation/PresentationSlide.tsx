import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import { SLIDE_COLORS, DEFAULT_SLIDE_COLOR } from "../../lib/slideColors";
import { capBullets } from "../../lib/text";

type Props = { slide: Slide; direction: number; theme: Theme };

// Renders one slide fullscreen for Presentation Mode, sliding in from the given direction
export default function PresentationSlide({ slide, direction, theme }: Props) {
  const color = SLIDE_COLORS[slide.type] ?? DEFAULT_SLIDE_COLOR;
  const bullets = capBullets(slide.bullets);
  const isDark = theme === "dark";

  return (
    <motion.div
      className="flex w-full max-w-4xl flex-col items-center text-center"
      initial={{ opacity: 0, x: direction * 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 80 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <span
        className="rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-widest"
        style={{ background: `${color}22`, color }}
      >
        {slide.type}
      </span>
      <h2 className={`mt-8 text-6xl font-bold leading-tight ${isDark ? "text-white" : "text-[#111111]"}`}>
        {slide.title}
      </h2>
      <ul className="mt-12 space-y-5">
        {bullets.map((b, i) => (
          <li key={i} className={`flex items-center gap-4 text-2xl ${isDark ? "text-white/80" : "text-[#333333]"}`}>
            <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: color }} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
