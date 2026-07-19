import type { Slide } from "../../../types/slide";
import type { SlideContext } from "./SlideCard";
import type { SlideTheme } from "../../../lib/premiumSlideTheme";
import HeroLayout from "./layouts/HeroLayout";
import ProblemLayout from "./layouts/ProblemLayout";
import SolutionLayout from "./layouts/SolutionLayout";
import SplitLayout from "./layouts/SplitLayout";
import ChartLayout from "./layouts/ChartLayout";
import CompetitorQuadrant from "./layouts/CompetitorQuadrant";

export type LayoutProps = { slide: Slide; context: SlideContext; slideTheme: SlideTheme };

// Dispatches a slide's body to its layoutType's dedicated composition — each owns its own title
// placement, since that varies wildly between e.g. hero's centered massive title and split's left column
export default function SlideLayout({ slide, context, slideTheme }: LayoutProps) {
  switch (slide.layoutType) {
    case "hero":
      return <HeroLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "problem":
      return <ProblemLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "solution":
      return <SolutionLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "split":
      return <SplitLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "chart":
      return <ChartLayout slide={slide} context={context} slideTheme={slideTheme} />;
    case "competitor_radar":
      return <CompetitorQuadrant slide={slide} context={context} slideTheme={slideTheme} />;
  }
}
