import type { Slide } from "../../types/slide";
import SlideCard from "../SlideCard";

type Props = { slides: Slide[] };

// Renders the "Your Pitch Deck" header with slide count, followed by the slide cards
export default function SlideList({ slides }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Your Pitch Deck</h2>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">{slides.length}</span>
      </div>
      {slides.map((s, i) => (
        <SlideCard key={`${s.title}-${i}`} slide={s} index={i} />
      ))}
    </div>
  );
}
