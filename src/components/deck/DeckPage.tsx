import { motion } from "framer-motion";
import { revealOnScroll } from "../../lib/motion";
import DeckDivider from "./DeckDivider";
import DeckInputPanel from "./DeckInputPanel";
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
  input: string;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  failed: boolean;
};

// Standalone Deck tab: a pitch input up top (auto-seeded from any Arena transcript, but never
// requiring one) that generates a deck straight from Groq, plus the resulting slide row + competitor
// radar once a deck exists — works exactly the same whether the founder came from the Arena or not
export default function DeckPage({
  slides,
  theme,
  competitors,
  isCompetitorsGenerating,
  competitorsFailed,
  input,
  onInputChange,
  onGenerate,
  isGenerating,
  failed,
}: Props) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col pb-28 pt-8">
      <DeckInputPanel
        input={input}
        onInputChange={onInputChange}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        theme={theme}
      />

      {failed && !isGenerating && (
        <p className="mt-3 px-6 text-center text-sm text-red-400">Something went wrong generating that deck — try again.</p>
      )}

      {slides.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 px-6 pt-10 text-center">
          <p className="text-sm" style={{ color: isDark ? "var(--color-text-muted)" : "var(--color-text-muted-light)" }}>
            {isGenerating ? "Forging your deck…" : "Your generated slides will appear here."}
          </p>
        </div>
      ) : (
        <>
          <DeckDivider theme={theme} />
          <SlideDeckRow slides={slides} theme={theme} />
          <motion.div className="mt-8" {...revealOnScroll}>
            <CompetitorRadarPanel competitors={competitors} isGenerating={isCompetitorsGenerating} failed={competitorsFailed} theme={theme} />
          </motion.div>
        </>
      )}
    </div>
  );
}
