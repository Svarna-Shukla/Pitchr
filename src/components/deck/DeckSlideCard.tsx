import { motion } from "framer-motion";
import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import { slideColor, slideLabel, slideGradient } from "../../lib/slideTheme";
import { capBullets } from "../../lib/text";
import SlideBullets from "../SlideBullets";
import SlideVisual, { FULL_WIDTH_VISUAL_TYPES } from "./visuals/SlideVisual";
import CopyButton from "../CopyButton";
import TiltCard from "../TiltCard";

type Props = { slide: Slide; index: number; total: number; theme: Theme };

// Renders one deck slide as a 16:9 landscape card with a per-type gradient and SVG visual
export default function DeckSlideCard({ slide, index, total, theme }: Props) {
  const isDark = theme === "dark";
  const color = slideColor(slide.type);
  const bullets = capBullets(slide.bullets);
  const copyText = () => `${slide.title}\n\n${bullets.map((b) => `- ${b}`).join("\n")}`;
  const fullWidthVisual = FULL_WIDTH_VISUAL_TYPES.has(slide.type);

  return (
    <motion.div
      className="w-[560px] shrink-0 snap-start"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.08 }}
    >
    <TiltCard
      className="aspect-video overflow-hidden rounded-2xl border p-8"
      style={{
        background: slideGradient(slide.type, isDark),
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ background: `${color}1f`, color }}
        >
          {slideLabel(slide.type)}
        </span>
        <CopyButton getText={copyText} />
      </div>

      <h3 className={`mt-4 max-w-[75%] font-display text-2xl font-semibold leading-tight ${isDark ? "text-white" : "text-[#111111]"}`}>
        {slide.title}
      </h3>

      {fullWidthVisual ? (
        <div className="mt-5">
          <SlideVisual slide={slide} color={color} isDark={isDark} />
        </div>
      ) : (
        <div className="mt-4 flex items-start justify-between gap-6">
          <div className="flex-1">
            <SlideBullets bullets={bullets} color={color} textClass={isDark ? "text-white/70" : "text-[#444444]"} />
          </div>
          <SlideVisual slide={slide} color={color} isDark={isDark} />
        </div>
      )}

      <span className={`absolute bottom-4 right-5 text-xs font-semibold ${isDark ? "text-white/25" : "text-black/25"}`}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span
        className={`absolute bottom-4 left-5 text-[10px] font-bold uppercase tracking-widest ${
          isDark ? "text-white/20" : "text-black/20"
        }`}
      >
        Pitchr
      </span>
    </TiltCard>
    </motion.div>
  );
}
