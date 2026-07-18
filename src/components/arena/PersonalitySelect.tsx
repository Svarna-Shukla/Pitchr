import { motion } from "framer-motion";
import { Cpu, EyeOff, Flame, GitCompare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PersonalityId } from "../../types/investor";
import { PERSONALITIES } from "../../lib/investorPersonalities";
import PersonalityCard from "./PersonalityCard";

type Props = { onSelect: (id: PersonalityId) => void };

const ICONS: Record<PersonalityId, LucideIcon> = { silent: EyeOff, shark: Flame, pattern: GitCompare, technical: Cpu };

// Phase 0 of the arena: before pitching, the founder picks which investor personality will grill
// them — each reshapes question tone, mask intensity, and voice feedback for the whole session
export default function PersonalitySelect({ onSelect }: Props) {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-8 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-3xl font-bold text-white">Choose Your Investor</h2>
      <p className="text-sm text-white/50">Every investor grills differently. Pick your fight.</p>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {PERSONALITIES.map((p) => (
          <PersonalityCard key={p.id} config={p} icon={ICONS[p.id]} onSelect={() => onSelect(p.id)} />
        ))}
      </div>
    </motion.div>
  );
}
