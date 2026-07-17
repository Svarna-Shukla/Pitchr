import { motion } from "framer-motion";
import type { Slide } from "../types/slide";
import SlideBullets from "./SlideBullets";
import CopyButton from "./CopyButton";

type Props = { slide: Slide; index: number };

// Colour scheme for each slide type
export const TYPE_CONFIG: Record<string, { border: string; badge: string; dot: string; glow: string; bg: string }> = {
  problem:  { border: "border-red-500",    badge: "bg-red-500/20 text-red-400",    dot: "bg-red-400",    glow: "shadow-red-500/30",    bg: "bg-gradient-to-br from-red-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
  solution: { border: "border-blue-500",   badge: "bg-blue-500/20 text-blue-400",  dot: "bg-blue-400",   glow: "shadow-blue-500/30",   bg: "bg-gradient-to-br from-blue-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
  market:   { border: "border-green-500",  badge: "bg-green-500/20 text-green-400",dot: "bg-green-400",  glow: "shadow-green-500/30",  bg: "bg-gradient-to-br from-green-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
  traction: { border: "border-yellow-500", badge: "bg-yellow-500/20 text-yellow-400",dot: "bg-yellow-400",glow: "shadow-yellow-500/30", bg: "bg-gradient-to-br from-yellow-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
  team:     { border: "border-purple-500", badge: "bg-purple-500/20 text-purple-400",dot: "bg-purple-400",glow: "shadow-purple-500/30", bg: "bg-gradient-to-br from-purple-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
  ask:      { border: "border-orange-500", badge: "bg-orange-500/20 text-orange-400",dot: "bg-orange-400",glow: "shadow-orange-500/30", bg: "bg-gradient-to-br from-orange-950/50 via-[#0f0f1a] to-[#0f0f1a]" },
};

const DEFAULT = { border: "border-white/20", badge: "bg-white/10 text-white/60", dot: "bg-white/40", glow: "shadow-white/10", bg: "bg-[#0f0f1a]" };

// Renders one premium pitch deck slide card with colour coded type and spring-in animation
export default function SlideCard({ slide, index }: Props) {
  const cfg = TYPE_CONFIG[slide.type] ?? DEFAULT;
  const copyText = () => `${slide.title}\n\n${slide.bullets.map((b) => `- ${b}`).join("\n")}`;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border-l-4 ${cfg.border} ${cfg.bg} p-6 shadow-2xl ${cfg.glow} ring-1 ring-inset ${cfg.border.replace("border", "ring")}/20`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
    >
      {/* Large slide number, sits behind the content */}
      <span className="pointer-events-none absolute left-4 top-2 text-5xl font-black text-white/5">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start justify-between">
        {/* Slide type badge */}
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${cfg.badge}`}>
          {slide.type}
        </span>
        <CopyButton getText={copyText} />
      </div>

      {/* Slide title */}
      <h3 className="mt-4 text-xl font-bold leading-snug text-white">
        {slide.title}
      </h3>

      {/* Divider */}
      <div className={`mt-3 h-px w-12 rounded ${cfg.border.replace("border", "bg")}`} />

      <SlideBullets bullets={slide.bullets} dotClass={cfg.dot} />
    </motion.div>
  );
}
