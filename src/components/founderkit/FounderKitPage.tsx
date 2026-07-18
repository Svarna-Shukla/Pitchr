import { useState } from "react";
import { Download } from "lucide-react";
import type { FounderKit } from "../../types/founderKit";
import type { Theme } from "../../hooks/useTheme";
import { exportFounderKitToPdf } from "../../lib/exportPdf";
import FounderKitPanel from "./FounderKitPanel";
import Button from "../Button";

type Props = { founderKit: FounderKit | null; isGenerating: boolean; failed: boolean; theme: Theme };

// Full-width Founder Kit tab page: heading, download-all button, and the generated document grid
export default function FounderKitPage({ founderKit, isGenerating, failed, theme }: Props) {
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
      <FounderKitPanel founderKit={founderKit} isGenerating={isGenerating} failed={failed} theme={theme} />
    </div>
  );
}
