import { motion } from "framer-motion";
import type { Slide } from "../types/slide";
import type { Theme } from "../hooks/useTheme";
import { SLIDE_COLORS, DEFAULT_SLIDE_COLOR } from "../lib/slideColors";
import { capBullets } from "../lib/text";
import SlideBullets from "./SlideBullets";
import CopyButton from "./CopyButton";

type Props = { slide: Slide; index: number; theme: Theme };

// Renders one pitch deck slide as a large, sparse card — dark or light themed,
// capped to 1 title + 3 short bullets with generous white space
export default function SlideCard({ slide, index, theme }: Props) {
  const color = SLIDE_COLORS[slide.type] ?? DEFAULT_SLIDE_COLOR;
  const bullets = capBullets(slide.bullets);
  const isDark = theme === "dark";
  const copyText = () => `${slide.title}\n\n${bullets.map((b) => `- ${b}`).join("\n")}`;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl p-8 transition-shadow duration-300 ${
        isDark ? "bg-[#111111]" : "bg-white shadow-md ring-1 ring-black/5"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.06 }}
      whileHover={
        isDark
          ? { boxShadow: `inset 0 0 32px -4px ${color}55` }
          : { y: -4, boxShadow: "0 20px 40px -14px rgba(0,0,0,0.2)" }
      }
    >
      {/* Left border: gradient bar matching the slide type colour */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(to bottom, ${color}, ${color}44)` }}
      />

      {/* Large faded slide number, top right, behind the content */}
      <span
        className={`pointer-events-none absolute right-6 top-2 select-none text-7xl font-black ${
          isDark ? "text-white/[0.06]" : "text-black/[0.05]"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start justify-between">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ background: `${color}1f`, color }}
        >
          {slide.type}
        </span>
        <CopyButton getText={copyText} />
      </div>

      <h3 className={`mt-6 max-w-[80%] text-[28px] font-bold leading-tight ${isDark ? "text-white" : "text-[#111111]"}`}>
        {slide.title}
      </h3>

      <SlideBullets bullets={bullets} color={color} textClass={isDark ? "text-white/70" : "text-[#444444]"} />
    </motion.div>
  );
}
