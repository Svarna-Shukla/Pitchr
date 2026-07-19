import { Wand2 } from "lucide-react";
import { PREMIUM_ACCENT_DEFAULT } from "../../lib/premiumSlideTheme";
import type { Theme } from "../../hooks/useTheme";

type Props = {
  input: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  theme: Theme;
};

// The Deck tab's standalone entry point: a pitch textarea (auto-seeded from an Arena transcript if
// one exists, editable either way) and a big orange Generate Deck button — no Arena run required
export default function DeckInputPanel({ input, onInputChange, onGenerate, isGenerating, theme }: Props) {
  const isDark = theme === "dark";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-6">
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Paste your pitch or type your idea here"
        rows={5}
        className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none ${
          isDark
            ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30"
            : "border-black/10 bg-black/[0.03] text-black placeholder:text-black/30 focus:border-black/30"
        }`}
      />
      <button
        onClick={onGenerate}
        disabled={!input.trim() || isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: PREMIUM_ACCENT_DEFAULT }}
      >
        <Wand2 className="h-5 w-5" /> {isGenerating ? "Forging your deck…" : "Generate Deck"}
      </button>
    </div>
  );
}
