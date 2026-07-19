import type { Slide } from "../../../types/slide";
import { PREMIUM_BG } from "../../../lib/premiumSlideTheme";
import SlideLayout from "./SlideLayout";

export type SlideContext = "grid" | "fullscreen" | "pdf";
type Props = { slide: Slide; index: number; total: number; context: SlideContext };

const PADDING: Record<SlideContext, string> = { grid: "p-6", fullscreen: "p-12", pdf: "p-12" };

// The forced-dark shell every deck slide shares (background, padding, 16:9 frame, footer index/mark),
// regardless of the app's own light/dark theme toggle — content is delegated to SlideLayout per layoutType
export default function PremiumSlide({ slide, index, total, context }: Props) {
  const background = slide.layoutType === "problem" ? "#0d0000" : PREMIUM_BG;

  return (
    <div
      className={`relative flex aspect-video h-full w-full flex-col overflow-hidden rounded-2xl ${PADDING[context]}`}
      style={{ background }}
    >
      <SlideLayout slide={slide} context={context} />
      <span className="absolute bottom-4 right-6 text-xs font-semibold text-white/25">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="absolute bottom-4 left-6 text-[10px] font-bold uppercase tracking-widest text-white/20">Pitchr</span>
    </div>
  );
}
