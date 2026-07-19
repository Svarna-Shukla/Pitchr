import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, i) => i);

// A scatter of small embers drifting upward behind the forging card, purely decorative
export default function ForgingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((i) => {
        const left = (i * 37) % 100;
        const delay = (i % 6) * 0.4;
        const duration = 3 + (i % 4);
        return (
          <motion.span
            key={i}
            className="absolute bottom-0 h-1 w-1 rounded-full bg-[color:var(--color-accent)]/70"
            style={{ left: `${left}%` }}
            animate={{ y: [-0, -320], opacity: [0, 0.8, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
