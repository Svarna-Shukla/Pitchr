import { motion } from "framer-motion";
import ForgingParticles from "./ForgingParticles";

// Full-bleed loading screen shown while Groq forges the player's card: a face-down card slowly rotating amid embers
export default function ForgingLoader() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden">
      <ForgingParticles />
      <motion.div
        className="h-40 w-28 rounded-2xl border-2 border-[color:var(--color-accent)]/60 shadow-2xl shadow-[color:var(--color-accent)]/20"
        style={{ background: "linear-gradient(160deg, #1a1a24, #0a0a0f)" }}
        animate={{ rotateY: [0, 180, 360], rotateZ: [0, 4, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-16 w-16 rounded-full border border-[color:var(--color-accent)]/40" />
        </div>
      </motion.div>
      <motion.p
        className="font-display text-sm font-semibold uppercase tracking-widest text-white/60"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        Forging your card…
      </motion.p>
    </div>
  );
}
