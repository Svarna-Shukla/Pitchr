import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Slide } from "../../types/slide";
import type { FounderKit } from "../../types/founderKit";
import type { Competitor } from "../../types/competitor";
import type { Theme } from "../../hooks/useTheme";
import PanelTabs, { type PanelTab } from "./PanelTabs";
import SlideList from "./SlideList";
import ThemeToggle from "../ThemeToggle";
import FounderKitPanel from "../founderkit/FounderKitPanel";
import CompetitorRadarPanel from "../competitorradar/CompetitorRadarPanel";

type Props = {
  slides: Slide[];
  theme: Theme;
  onToggleTheme: () => void;
  onClear: () => void;
  founderKit: FounderKit | null;
  isFounderKitGenerating: boolean;
  founderKitFailed: boolean;
  onOpenFounderKit: () => void;
  competitors: Competitor[] | null;
  isCompetitorsGenerating: boolean;
  competitorsFailed: boolean;
  onOpenCompetitorRadar: () => void;
};

// Tabbed right-hand panel: generated slides, Founder Kit, and Competitor Radar
export default function SidePanel(props: Props) {
  const [tab, setTab] = useState<PanelTab>("slides");

  // Switches tabs, lazily triggering that tab's generation the first time it's opened
  const handleChange = (next: PanelTab) => {
    setTab(next);
    if (next === "kit") props.onOpenFounderKit();
    if (next === "radar") props.onOpenCompetitorRadar();
  };

  return (
    <div className="flex w-full flex-col gap-4 overflow-y-auto border-l border-white/5 p-6 pt-24 pb-24 md:w-[28rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Pitch Deck</h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{props.slides.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={props.theme} onToggle={props.onToggleTheme} />
          <button
            onClick={props.onClear}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      <PanelTabs active={tab} onChange={handleChange} slidesReady={props.slides.length > 0} />
      {tab === "slides" && <SlideList slides={props.slides} theme={props.theme} />}
      {tab === "kit" && (
        <FounderKitPanel
          founderKit={props.founderKit}
          isGenerating={props.isFounderKitGenerating}
          failed={props.founderKitFailed}
        />
      )}
      {tab === "radar" && (
        <CompetitorRadarPanel
          competitors={props.competitors}
          isGenerating={props.isCompetitorsGenerating}
          failed={props.competitorsFailed}
        />
      )}
    </div>
  );
}
