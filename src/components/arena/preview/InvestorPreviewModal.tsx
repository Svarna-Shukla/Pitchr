import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { PersonalityConfig } from "../../../types/investor";
import { getInvestorColor } from "../../../lib/investorProfiles";
import { playInvestorPreview, stopInvestorPreviewAudio } from "../../../lib/investorPreviewAudio";
import Button from "../../Button";
import InvestorHeadPreview from "./InvestorHeadPreview";

type Props = { investor: PersonalityConfig; onClose: () => void; onStartBattle: () => void };

// Pre-session preview: a live 3D rotating head, the investor's name/archetype/description, a voice
// sample of their greeting line, and the "Start Battle" commit button. Opened from PersonalitySelect
// when a card is clicked, instead of that click immediately starting the pitch.
export default function InvestorPreviewModal({ investor, onClose, onStartBattle }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop any preview clip left playing (e.g. the modal was closed mid-clip) so it doesn't keep
  // playing in the background once this instance unmounts.
  useEffect(() => stopInvestorPreviewAudio, []);

  const playSample = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await playInvestorPreview(investor.id);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 text-center"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-white/40 transition hover:text-white/80" aria-label="Close preview">
            <X className="h-5 w-5" />
          </button>

          <div className="h-48 w-48">
            <InvestorHeadPreview investorId={investor.id} />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-white">{investor.name}</h2>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: getInvestorColor(investor) }}>
              {investor.archetype}
            </p>
          </div>
          <p className="text-sm text-white/60">{investor.description}</p>
          <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm italic text-white/70">"{investor.greetingText}"</p>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button variant="ghost" onClick={playSample} disabled={isPlaying} className="flex-1">
              🔊 {isPlaying ? "Playing…" : "Play Voice Sample"}
            </Button>
            <Button onClick={onStartBattle} className="flex-1">
              Start Battle
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
