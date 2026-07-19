import type { Theme } from "../../hooks/useTheme";
import { FOUNDER_KIT_OUTPUTS, type FounderKitOutputKey } from "../../types/founderKit";

type Props = { selected: Set<FounderKitOutputKey>; onToggle: (key: FounderKitOutputKey) => void; theme: Theme };

// Lets the founder pick which of the 17 outputs to actually render below, defaulting to all selected
export default function FounderKitChecklist({ selected, onToggle, theme }: Props) {
  const isDark = theme === "dark";
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {FOUNDER_KIT_OUTPUTS.map((o) => {
        const on = selected.has(o.key);
        return (
          <label
            key={o.key}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              on
                ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
                : isDark
                  ? "border-white/10 text-white/40"
                  : "border-black/10 text-black/40"
            }`}
          >
            <input type="checkbox" checked={on} onChange={() => onToggle(o.key)} className="sr-only" />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}
