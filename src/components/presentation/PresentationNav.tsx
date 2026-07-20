import { X } from "lucide-react";
import type { SlideTheme } from "../../lib/premiumSlideTheme";
import SlideNav from "../SlideNav";
import ThemeRemixer from "../deck/ThemeRemixer";

type Props = {
  index: number;
  total: number;
  slideTheme: SlideTheme;
  onSelectSlideTheme: (theme: SlideTheme) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

// Close button, large translucent prev/next arrows, the ThemeRemixer switcher bar, and a clear
// "Slide X of N" counter for Presentation Mode — chrome is always dark-appropriate since the stage
// itself is always dark, independent of whichever slideTheme the slides themselves are rendering in
export default function PresentationNav({ index, total, slideTheme, onSelectSlideTheme, onPrev, onNext, onClose }: Props) {
  return (
    <>
      <div className="absolute left-6 top-6 z-20">
        <ThemeRemixer active={slideTheme} onSelect={onSelectSlideTheme} />
      </div>
      <button onClick={onClose} className="absolute right-6 top-6 z-20 text-white/50 transition hover:text-white" aria-label="Close">
        <X className="h-7 w-7" />
      </button>
      <SlideNav onPrev={onPrev} onNext={onNext} canPrev={index > 0} canNext={index < total - 1} variant="floating" layout="sides" />
      <span
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-lg font-bold text-white/60"
        style={{ fontVariantCaps: "small-caps" as const }}
      >
        Slide {index + 1} of {total}
      </span>
    </>
  );
}
