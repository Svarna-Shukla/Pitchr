import { X } from "lucide-react";
import SlideNav from "../SlideNav";

type Props = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

// Close button, large translucent prev/next arrows, and a clear "Slide X of N" counter for
// Presentation Mode — chrome is always dark-appropriate since the stage itself is always dark
export default function PresentationNav({ index, total, onPrev, onNext, onClose }: Props) {
  return (
    <>
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
