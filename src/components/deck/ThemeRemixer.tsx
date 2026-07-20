import type { SlideTheme } from "../../lib/premiumSlideTheme";
import { SLIDE_PALETTES } from "../../lib/premiumSlideTheme";

type Props = { active: SlideTheme; onSelect: (theme: SlideTheme) => void };

const THEMES: { id: SlideTheme; label: string }[] = [
  { id: "neon", label: "Pitchr Neon" },
  { id: "yc", label: "YC Minimal" },
  { id: "cyberpunk", label: "Cyberpunk" },
];

// 1-click deck theme switcher: 3 pills, each showing a small bg+accent swatch of that theme, the
// active one highlighted. Selecting a theme restyles every slide's background, typography, and
// chart colours instantly via the shared SlideTheme prop already threaded through SlideCard,
// SlideChart, and every layout — this component only owns the switch itself, not the styling.
export default function ThemeRemixer({ active, onSelect }: Props) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 p-1">
      {THEMES.map((t) => {
        const palette = SLIDE_PALETTES[t.id];
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isActive ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
            }`}
            aria-label={`Switch deck theme to ${t.label}`}
            aria-pressed={isActive}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-white/20"
              style={{ background: palette.background, boxShadow: `inset 0 0 0 3px ${palette.accent}` }}
            />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
