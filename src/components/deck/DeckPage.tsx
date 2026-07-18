import { motion } from "framer-motion";
import { revealOnScroll } from "../../lib/motion";
import DeckDivider from "./DeckDivider";
import SlideDeckRow from "./SlideDeckRow";
import CompetitorRadarPanel from "../competitorradar/CompetitorRadarPanel";
import type { Slide } from "../../types/slide";
import type { Competitor } from "../../types/competitor";
import type { Theme } from "../../hooks/useTheme";

type Props = {
  slides: Slide[];
  theme: Theme;
  competitors: Competitor[] | null;
  isCompetitorsGenerating: boolean;
  competitorsFailed: boolean;
};

// Pure output view: the deck only ever gets slides once a Battle Arena run finishes and "Generate My
// Deck" is pressed, so this tab is just the horizontal slide row + competitor radar for that result.
export default function DeckPage({ slides, theme, competitors, isCompetitorsGenerating, competitorsFailed }: Props) {
  const isDark = theme === "dark";

  if (slides.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-6 pb-28 text-center">
        <p className="text-sm" style={{ color: isDark ? "var(--color-text-muted)" : "var(--color-text-muted-light)" }}>
          Win a Battle Arena round to forge your first deck.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-28 pt-10">
      <DeckDivider theme={theme} />
      <SlideDeckRow slides={slides} theme={theme} />
      <motion.div className="mt-8" {...revealOnScroll}>
        <CompetitorRadarPanel competitors={competitors} isGenerating={isCompetitorsGenerating} failed={competitorsFailed} theme={theme} />
      </motion.div>
    </div>
  );
}
