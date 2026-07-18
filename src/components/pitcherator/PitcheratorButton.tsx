import { motion } from "framer-motion";
import { Zap } from "lucide-react";

type Props = { disabled: boolean; onClick: () => void };

// Secondary mode button that launches the Pitcherator investor-grilling flow
export default function PitcheratorButton({ disabled, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] outline-none disabled:cursor-not-allowed disabled:opacity-30"
      aria-label="Start Pitcherator"
    >
      <Zap className="h-5 w-5" />
    </motion.button>
  );
}
