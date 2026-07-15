import { motion } from "framer-motion";
import type { Slide } from "../types/slide";

type Props = { slide: Slide; index: number };

const TYPE_COLORS: Record<string, string> = {
  problem: "text-red-400",
  solution: "text-green-400",
  market: "text-blue-400",
  traction: "text-yellow-400",
  team: "text-purple-400",
  ask: "text-pink-400",
};

// Renders one pitch deck slide as a dark glassmorphism card with a fade-in animation
export default function SlideCard({ slide, index }: Props) {
  const color = TYPE_COLORS[slide.type] ?? "text-white/50";

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <span className={`text-xs font-medium uppercase tracking-wider ${color}`}>
        {slide.type}
      </span>
      <h3 className="mt-2 text-lg font-bold text-white">{slide.title}</h3>
      <ul className="mt-3 space-y-2">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70">
            <span className="text-white/30">•</span>
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
