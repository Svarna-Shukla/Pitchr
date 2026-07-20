import type { Slide } from "../../../types/slide";
import type { SlideContext } from "./SlideCard";
import type { SlideTheme } from "../../../lib/premiumSlideTheme";
import HeroLayout from "./layouts/HeroLayout";
import HeroSplitLayout from "./layouts/HeroSplitLayout";
import HeroMinimalLayout from "./layouts/HeroMinimalLayout";
import ProblemLayout from "./layouts/ProblemLayout";
import SolutionLayout from "./layouts/SolutionLayout";
import SplitLayout from "./layouts/SplitLayout";
import ValuePropsLayout from "./layouts/ValuePropsLayout";
import TimelineLayout from "./layouts/TimelineLayout";
import ChartLayout from "./layouts/ChartLayout";
import CompetitorQuadrant from "./layouts/CompetitorQuadrant";

export type LayoutProps = { slide: Slide; context: SlideContext; slideTheme: SlideTheme };

// Dispatches a slide's body to its layoutType's dedicated composition — each owns its own title
// placement, since that varies wildly between e.g. hero's centered massive title and split's left column
export default function SlideLayout({ slide, context, slideTheme }: LayoutProps) {
  switch (slide.layoutType) {
    case "hero":
      return <HeroLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "hero_split":
      return <HeroSplitLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "hero_minimal":
      return <HeroMinimalLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "problem":
      return <ProblemLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "solution":
      return <SolutionLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "split":
      return <SplitLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "value_props":
      return <ValuePropsLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "timeline":
      return <TimelineLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "chart":
      // Safety fallback: a chart layout with no usable chart data degrades to the always-safe
      // split layout instead of rendering an empty chart area (defense-in-depth alongside the
      // normalization guard in useClaude.ts, which should already prevent this from occurring).
      if (!slide.chart || !slide.chart.data.length) return <SplitLayout slide={slide} context={context} slideTheme={slideTheme} />;
      return <ChartLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "competitor_radar":
      return <CompetitorQuadrant slide={slide} context={context} slideTheme={slideTheme} />;
  }
}
