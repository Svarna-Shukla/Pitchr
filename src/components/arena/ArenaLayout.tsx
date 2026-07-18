import type { ReactNode } from "react";
import { motion } from "framer-motion";
import EmberParticles from "./EmberParticles";

type Props = { children: ReactNode };

// Static jagged polyline in a given corner, styled as a faint red lightning-crack accent
function CornerBolt({ corner }: { corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const pos = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0 -scale-x-100",
    "bottom-left": "left-0 bottom-0 -scale-y-100",
    "bottom-right": "right-0 bottom-0 -scale-x-100 -scale-y-100",
  }[corner];
  return (
    <svg className={`pointer-events-none absolute h-40 w-40 opacity-40 ${pos}`} viewBox="0 0 100 100" fill="none">
      <path d="M0 0 L40 10 L25 30 L55 45 L35 60 L60 100" stroke="#dc2626" strokeWidth="1.5" />
    </svg>
  );
}

// Full-viewport immersive shell for every Battle Arena phase: dark backdrop, red hex-grid floor, extreme
// vignette, drifting embers, corner lightning accents, and the pulsing center fault line that splits the
// two fighters. Sits above the app's normal nav (z-30) so the arena fully takes over the screen.
export default function ArenaLayout({ children }: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#080808]">
      <div className="arena-hex-grid absolute inset-0" />
      <div className="arena-vignette absolute inset-0" />
      <EmberParticles />
      <CornerBolt corner="top-left" />
      <CornerBolt corner="top-right" />
      <CornerBolt corner="bottom-left" />
      <CornerBolt corner="bottom-right" />

      <motion.div
        className="absolute bottom-0 left-1/2 top-0 w-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent blur-[2px]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">{children}</div>
    </div>
  );
}
