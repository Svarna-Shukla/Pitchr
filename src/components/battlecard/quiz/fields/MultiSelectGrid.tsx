import { motion } from "framer-motion";

type Props = { label: string; values: string[]; options: string[]; onToggle: (v: string) => void };

// A set of clickable multi-select option chips — any number can be active at once
export default function MultiSelectGrid({ label, values, options, onToggle }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <motion.button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              whileTap={{ scale: 0.96 }}
              className={`min-h-11 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                active
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-strong)]"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/25"
              }`}
            >
              {active ? "✓ " : ""}
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
