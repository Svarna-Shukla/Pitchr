import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import { slideColor, slideLabel } from "../../lib/slideTheme";
import { capBullets } from "../../lib/text";
import SlideBullets from "../SlideBullets";

type Props = { slide: Slide; direction: number; theme: Theme };

// Renders one slide fullscreen for Presentation Mode, sliding in from the given direction
export default function PresentationSlide({ slide, direction, theme }: Props) {
  const color = slideColor(slide.type);
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
        {slideLabel(slide.type)}
      </span>
      <h2 className={`mt-8 font-display text-6xl font-semibold leading-tight ${isDark ? "text-white" : "text-[#111111]"}`}>{slide.title}</h2>
      <div className="mt-12 [&_ul]:items-center [&_li]:justify-center [&_li]:text-2xl">
        <SlideBullets bullets={bullets} color={color} textClass={isDark ? "text-white/80" : "text-[#333333]"} />
      </div>
    </motion.div>
  );
}
