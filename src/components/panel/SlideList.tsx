import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import SlideCard from "../SlideCard";

type Props = { slides: Slide[]; theme: Theme };

// Renders the generated slide cards with generous spacing between them
export default function SlideList({ slides, theme }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {slides.map((s, i) => (
        <SlideCard key={`${s.title}-${i}`} slide={s} index={i} theme={theme} />
      ))}
    </div>
  );
}
