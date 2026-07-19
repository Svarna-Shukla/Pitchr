import { motion } from "framer-motion";

type Props = { label: string; value: string; options: string[]; onChange: (v: string) => void; columns?: 2 | 4 };

// A set of big clickable single-select option buttons, used for every "pick one" quiz question
export default function OptionGrid({ label, value, options, onChange, columns = 4 }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">{label}</label>
      <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {options.map((o) => {
          const active = value === o;
          return (
            <motion.button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              whileTap={{ scale: 0.96 }}
              className={`min-h-11 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                active
                  ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-strong)]"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/25"
              }`}
            >
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
