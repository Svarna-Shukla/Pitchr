import { motion } from "framer-motion";
import type { ScorecardRatings } from "../../types/pitcherator";

type Props = { ratings: ScorecardRatings };

const LABELS: { key: keyof ScorecardRatings; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Confidence" },
  { key: "marketUnderstanding", label: "Market Understanding" },
  { key: "problemStrength", label: "Problem Strength" },
  { key: "defensibility", label: "Defensibility" },
  { key: "ask", label: "Ask" },
];

// Renders the 6 core evaluation bars, filling in one after another for a "structural readout" feel
export default function ScoreMatrix({ ratings }: Props) {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {LABELS.map((l, i) => (
        <div key={l.key}>
          <div className="flex justify-between text-sm text-white/60">
            <span>{l.label}</span>
            <span>{ratings[l.key]}/10</span>
          </div>
          <div className="mt-1 h-2.5 rounded-full bg-white/10">
            <motion.div
              className="h-2.5 origin-left rounded-full bg-orange-400"
              style={{ width: `${ratings[l.key] * 10}%` }}
              initial={{ scaleX: 0, opacity: 0.3 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
