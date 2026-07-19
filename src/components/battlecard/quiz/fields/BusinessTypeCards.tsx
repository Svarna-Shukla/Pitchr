import { motion } from "framer-motion";
import type { BusinessType } from "../../../../types/battleCard";

type Props = { value: BusinessType | ""; onChange: (v: BusinessType) => void };

const TYPES: { id: BusinessType; blurb: string }[] = [
  { id: "B2B", blurb: "You sell to businesses" },
  { id: "B2C", blurb: "You sell to consumers" },
  { id: "Marketplace", blurb: "You connect both sides" },
];

// Three big clickable cards for choosing the company's business type
export default function BusinessTypeCards({ value, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Business type</label>
      <div className="grid grid-cols-3 gap-2.5">
        {TYPES.map((t) => {
          const active = value === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              whileTap={{ scale: 0.96 }}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-4 text-center transition ${
                active
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]"
                  : "border-white/10 bg-white/5 hover:border-white/25"
              }`}
            >
              <span className={`text-sm font-black ${active ? "text-[color:var(--color-accent-strong)]" : "text-white"}`}>{t.id}</span>
              <span className="text-[10px] text-white/45">{t.blurb}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
