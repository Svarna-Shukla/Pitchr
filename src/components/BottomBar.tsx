import { Download, History, Play, RotateCcw } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

type Props = {
  hasSlides: boolean;
  exporting: boolean;
  theme: Theme;
  onPresent: () => void;
  onExport: () => void;
  onSessions: () => void;
  onClear: () => void;
};

// Floating action bar with quick actions: Present, Export, Sessions, Clear
export default function BottomBar({
  hasSlides,
  exporting,
  theme,
  onPresent,
  onExport,
  onSessions,
  onClear,
}: Props) {
  const isDark = theme === "dark";
  const textColor = isDark ? "var(--color-text-secondary)" : "var(--color-text-secondary-light)";
  const base = "flex min-h-11 items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 hover:text-[color:var(--color-accent)]";
  const divider = <span className="h-4 w-px" style={{ background: isDark ? "var(--color-border)" : "var(--color-border-light)" }} />;

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div
        className="flex flex-wrap items-center justify-center gap-1 rounded-xl border px-2 py-1.5 shadow-2xl"
        style={{
          borderColor: isDark ? "var(--color-border)" : "var(--color-border-light)",
          background: isDark ? "var(--color-surface)" : "var(--color-surface-light)",
        }}
      >
        <button onClick={onPresent} disabled={!hasSlides} className={base} style={{ color: textColor }}>
          <Play className="h-4 w-4" /> Present
        </button>
        <button onClick={onExport} disabled={!hasSlides || exporting} className={base} style={{ color: textColor }}>
          <Download className="h-4 w-4" /> {exporting ? "Exporting…" : "Export"}
        </button>
        {divider}
        <button onClick={onSessions} className={base} style={{ color: textColor }}>
          <History className="h-4 w-4" /> Sessions
        </button>
        <button onClick={onClear} className={base} style={{ color: textColor }}>
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
