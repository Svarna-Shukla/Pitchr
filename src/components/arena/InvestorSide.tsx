import { motion } from "framer-motion";
import InvestorMaskScene from "./InvestorMaskScene";

type Props = { investorHealth: number; isAttacking: boolean; isListening: boolean };

// Left half of the arena: the AI investor's identity, its live health bar, and its 3D mask canvas
export default function InvestorSide({ investorHealth, isAttacking, isListening }: Props) {
  return (
    <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4 pr-6">
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-red-500">
          <span>AI Investor</span>
          <span>{Math.round(investorHealth)}/100</span>
        </div>
        <div className="mt-1 h-4 w-full rounded-sm border border-red-900 bg-gray-900">
          <motion.div
            className="h-full bg-red-600"
            animate={{ width: `${investorHealth}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="h-64 w-64 sm:h-80 sm:w-80">
        <InvestorMaskScene isAttacking={isAttacking} isListening={isListening} />
      </div>
    </div>
  );
}
