import { motion } from "framer-motion";
import type { Scorecard } from "../../types/pitcherator";
import CopyButton from "../CopyButton";

type Props = { scorecard: Scorecard };

const LABELS: { key: keyof Scorecard["ratings"]; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Confidence" },
  { key: "marketUnderstanding", label: "Market Understanding" },
  { key: "problemStrength", label: "Problem Strength" },
  { key: "defensibility", label: "Defensibility" },
  { key: "ask", label: "Ask" },
];

// Renders the 6 rating bars and improvement suggestions from a completed Pitcherator scorecard
export default function ScorecardCard({ scorecard }: Props) {
  const copyText = () =>
    LABELS.map((l) => `${l.label}: ${scorecard.ratings[l.key]}/10`).join("\n") +
    "\n\nImprove:\n" +
    scorecard.suggestions.map((s) => `- ${s}`).join("\n");

  return (
    <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-[#0f0f1a] p-6 shadow-2xl shadow-purple-500/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Your Scorecard</h3>
        <CopyButton getText={copyText} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {LABELS.map((l) => (
          <div key={l.key}>
            <div className="flex justify-between text-xs text-white/60">
              <span>{l.label}</span>
              <span>{scorecard.ratings[l.key]}/10</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-white/10">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${scorecard.ratings[l.key] * 10}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>
      <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-white/50">Improve</h4>
      <ul className="mt-2 space-y-1.5">
        {scorecard.suggestions.map((s, i) => (
          <li key={i} className="text-sm text-white/80">- {s}</li>
        ))}
      </ul>
    </div>
  );
}
