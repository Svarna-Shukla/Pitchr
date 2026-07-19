import { Download, Wand2 } from "lucide-react";
import { useState } from "react";
import type { Theme } from "../../hooks/useTheme";
import { exportFounderKitToPdf } from "../../lib/exportPdf";
import type { FounderKit } from "../../types/founderKit";
import Button from "../Button";
import FounderKitPanel from "./FounderKitPanel";

type Props = {
  founderKit: FounderKit | null;
  isGenerating: boolean;
  failed: boolean;
  theme: Theme;
  input: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
};

// Full-width Founder Kit tab page: a pitch input the founder can type into, paste over, or that
// auto-fills from a deck/arena transcript, a Generate button, and the resulting document grid
export default function FounderKitPage({ founderKit, isGenerating, failed, theme, input, onInputChange, onGenerate }: Props) {
  const [exporting, setExporting] = useState(false);
  const isDark = theme === "dark";

  // Downloads every Founder Kit document as a single PDF
  const handleDownload = () => {
    if (!founderKit) return;
    setExporting(true);
    try {
      exportFounderKitToPdf(founderKit, theme);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`font-display text-lg font-semibold ${isDark ? "text-white" : "text-black"}`}>Founder Kit</h2>
        <Button onClick={handleDownload} disabled={!founderKit || exporting} className="px-4 py-2 text-xs">
          <Download className="h-3.5 w-3.5" /> {exporting ? "Exporting…" : "Download All as PDF"}
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Your idea or paste your pitch transcript here"
          rows={5}
          className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none ${
            isDark
              ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30"
              : "border-black/10 bg-black/[0.03] text-black placeholder:text-black/30 focus:border-black/30"
          }`}
        />
        <Button onClick={onGenerate} disabled={!input.trim() || isGenerating} className="self-start px-4 py-2 text-xs">
          <Wand2 className="h-3.5 w-3.5" /> {isGenerating ? "Generating…" : "Generate Founder Kit"}
        </Button>
      </div>

      <FounderKitPanel founderKit={founderKit} isGenerating={isGenerating} failed={failed} theme={theme} />
    </div>
  );
}

