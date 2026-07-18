import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { PersonalityConfig } from "../../types/investor";

type Props = { config: PersonalityConfig; icon: LucideIcon; onSelect: () => void };

// A single investor personality picker card: icon, name, tagline, description — tapping/clicking
// selects that investor and moves the founder into pitch intake
export default function PersonalityCard({ config, icon: Icon, onSelect }: Props) {
  return (
    <motion.button
      onClick={onSelect}
      className="flex min-h-[44px] flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-orange-400/50 hover:bg-white/10"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="h-6 w-6 text-orange-400" />
      <h3 className="font-display text-base font-bold text-white sm:text-lg">{config.name}</h3>
      <p className="text-sm font-semibold text-white/60">{config.tagline}</p>
      <p className="text-sm text-white/40">{config.description}</p>
    </motion.button>
  );
}
