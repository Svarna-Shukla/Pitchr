import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

// Prev/next arrows, slide counter, and close button for Presentation Mode
export default function PresentationNav({ index, total, onPrev, onNext, onClose }: Props) {
  return (
    <>
      <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white" aria-label="Close">
        <X className="h-7 w-7" />
      </button>
      <button
        onClick={onPrev}
        disabled={index === 0}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-10 w-10" />
      </button>
      <button
        onClick={onNext}
        disabled={index === total - 1}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white disabled:opacity-20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-10 w-10" />
      </button>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/50">
        {index + 1} of {total}
      </span>
    </>
  );
}
