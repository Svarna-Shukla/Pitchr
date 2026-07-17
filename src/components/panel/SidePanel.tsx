import { useState } from "react";
import type { Slide } from "../../types/slide";
import type { FounderKit } from "../../types/founderKit";
import type { Competitor } from "../../types/competitor";
import PanelTabs, { type PanelTab } from "./PanelTabs";
import SlideList from "./SlideList";
import FounderKitPanel from "../founderkit/FounderKitPanel";
import CompetitorRadarPanel from "../competitorradar/CompetitorRadarPanel";

type Props = {
  slides: Slide[];
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
      <PanelTabs active={tab} onChange={handleChange} slidesReady={props.slides.length > 0} />
      {tab === "slides" && <SlideList slides={props.slides} />}
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
