import { motion } from "framer-motion";
import type { ArenaRound } from "../../../types/arena";
import type { VoiceAnalytics } from "../../../types/voice";
import { summarizeVoiceDelivery } from "../../../utils/voiceAnalytics";
import FillerWordMeter from "./FillerWordMeter";
import PaceGauge from "./PaceGauge";
import AuthorityScoreCard from "./AuthorityScoreCard";
import DeliveryTips from "./DeliveryTips";

type Props = { rounds: ArenaRound[] };

const hasVoiceAnalytics = (a?: VoiceAnalytics): a is VoiceAnalytics => !!a;

// Delivery & Voice Analysis sub-card on the scorecard: aggregates every round's voice analytics (for
// founders who answered by speaking) into filler-word, pace, and authority readouts plus two tips.
// Renders nothing if the founder never used voice input this session.
export default function VoiceDeliveryCard({ rounds }: Props) {
  const voiceRounds = rounds.map((r) => r.voiceAnalytics).filter(hasVoiceAnalytics);
  if (!voiceRounds.length) return null;
  const summary = summarizeVoiceDelivery(voiceRounds);

  return (
    <motion.div
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-[#38bdf8]/20 bg-[#0c1b2a]/50 p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#7dd3fc]">Delivery & Voice Analysis</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FillerWordMeter count={summary.totalFillerCount} />
        <PaceGauge wpm={summary.averageWpm} tag={summary.paceTag} />
        <AuthorityScoreCard score={summary.authorityScore} />
      </div>
      <DeliveryTips summary={summary} />
    </motion.div>
  );
}
