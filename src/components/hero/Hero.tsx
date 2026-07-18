import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Presentation, TrendingUp, Users } from "lucide-react";
import { easeOutExpo } from "../../lib/motion";

const HeroScene = lazy(() => import("./HeroScene"));

type Props = { onStartPitching: () => void; onTypeInstead: () => void };

const STATS = [
  { icon: Users, label: "10,000+ founders trained" },
  { icon: TrendingUp, label: "Avg score improvement: 34%" },
  { icon: Presentation, label: "Used in 50+ pitch rooms" },
];

const TEXT_PRIMARY = "#111111";
const TEXT_SECONDARY = "#5c5b58";

// Editorial hero: left-aligned bold headline + copy + CTA on the left, the low-poly WebGL mask on the
// right on desktop (centered above the copy on mobile). Always light — this is the marketing landing
// screen for the Arena tab, independent of the app's dark/light theme toggle used by the other tabs.
export default function Hero({ onStartPitching, onTypeInstead }: Props) {
  return (
    <section
      className="relative flex w-full flex-col items-center gap-8 px-6 pt-6 md:min-h-[600px] md:flex-row md:items-center md:justify-between md:gap-10 md:px-14 lg:px-20"
      style={{ background: "#fafafa" }}
    >
      <div className="order-2 flex max-w-xl flex-col items-center text-center md:order-1 md:items-start md:text-left">
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[56px] md:text-[72px]"
            style={{ color: TEXT_PRIMARY }}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOutExpo }}
          >
            Meet Your Harshest Critic.
          </motion.h1>
        </div>

        <motion.p
          className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
          style={{ color: TEXT_SECONDARY }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
        >
          Pitch your idea. Get grilled by an AI investor that never goes easy. Walk out ready for anything.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: easeOutExpo }}
        >
          <button
            onClick={onStartPitching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-black sm:w-auto"
          >
            Start Pitching <span aria-hidden>→</span>
          </button>
          <button
            onClick={onTypeInstead}
            className="text-sm font-medium underline underline-offset-4 transition hover:opacity-70"
            style={{ color: TEXT_SECONDARY }}
          >
            or type your idea instead
          </button>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 md:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: TEXT_SECONDARY }}>
              <s.icon className="h-3.5 w-3.5" style={{ color: "#f97316" }} />
              {s.label}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="order-1 relative mx-auto h-[300px] w-[300px] md:order-2 md:mx-0 md:h-[560px] md:w-auto md:max-w-none md:flex-1">
        <Suspense fallback={<HeroScenePlaceholder />}>
          <HeroScene />
        </Suspense>
      </div>
    </section>
  );
}

// Lightweight pulsing placeholder shown while the WebGL scene chunk is still loading
function HeroScenePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle, #f9731633, transparent 70%)" }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
