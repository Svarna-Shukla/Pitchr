import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, Target, Mic2, TrendingUp } from "lucide-react";
import type { PersonalityConfig } from "../../../types/investor";
import { buildCoachTips } from "../../../lib/coachTips";

type Props = { investor: PersonalityConfig; roundNumber: number; visible: boolean };

// Collapsible right-side coaching card shown while Help Mode is on: a live-rotating read on this
// investor's temperament, which framework to structure the answer with, a vocal-delivery nudge, and
// the specific numbers this personality actually wants to hear. Starts collapsed to a small tab on
// narrow viewports so it never eats the question/response area on a phone.
export default function CoachTipsPanel({ investor, roundNumber, visible }: Props) {
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const tips = buildCoachTips(investor, roundNumber);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-0 top-1/2 z-[64] -translate-y-1/2 pr-2 sm:pr-4"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand coach tips"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/30 bg-black/60 text-amber-300 backdrop-blur-md transition hover:border-amber-400/60"
            >
              <Lightbulb className="h-4 w-4" />
            </button>
          ) : (
            <motion.div
              layout
              className="w-[82vw] max-w-[300px] rounded-2xl border border-amber-400/20 bg-black/70 p-4 text-left shadow-[0_0_40px_-10px_rgba(240,160,32,0.25)] backdrop-blur-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300">
                  <Lightbulb className="h-3.5 w-3.5" /> Coach Tips
                </span>
                <button onClick={() => setCollapsed(true)} aria-label="Collapse coach tips" className="text-white/40 transition hover:text-white/80">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Tip key={`investor-${roundNumber}`} icon={<Target className="h-3.5 w-3.5" />} label={tips.investor.label} text={tips.investor.text} />
                <Tip key={`framework-${roundNumber}`} icon={<Target className="h-3.5 w-3.5" />} label={tips.framework.label} text={tips.framework.text} />
                <Tip key={`delivery-${roundNumber}`} icon={<Mic2 className="h-3.5 w-3.5" />} label={tips.delivery.label} text={tips.delivery.text} />
                <Tip
                  key={`metrics-${roundNumber}`}
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="Mention"
                  text={`Numbers ${investor.name} wants to hear: ${tips.metrics}.`}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tip({ icon, label, text }: { icon: ReactNode; label: string; text: string }) {
  return (
    <motion.div className="flex gap-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <span className="mt-0.5 shrink-0 text-amber-400/70">{icon}</span>
      <p className="text-[13px] leading-snug text-white/80">
        <span className="font-semibold text-white/95">{label}: </span>
        {text}
      </p>
    </motion.div>
  );
}
