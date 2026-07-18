import { useMemo } from "react";
import { motion } from "framer-motion";

const EMBER_COUNT = 26;

type Ember = { left: string; size: number; duration: number; delay: number };

// Deterministic-enough scatter of embers across the arena width, memoized so they don't reshuffle on re-render
function buildEmbers(): Ember[] {
  return Array.from({ length: EMBER_COUNT }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    size: 2 + ((i * 13) % 4),
    duration: 6 + ((i * 7) % 10),
    delay: (i * 0.35) % 8,
  }));
}

// Slow-drifting orange embers rising from the bottom of the viewport, giving the arena floor a live, smoldering feel
export default function EmberParticles() {
  const embers = useMemo(buildEmbers, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((ember, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-orange-500"
          style={{ left: ember.left, width: ember.size, height: ember.size, boxShadow: "0 0 6px 2px rgba(249,115,22,0.6)" }}
          initial={{ y: 1000, opacity: 0 }}
          animate={{ y: -100, opacity: [0, 0.9, 0] }}
          transition={{ duration: ember.duration, delay: ember.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
