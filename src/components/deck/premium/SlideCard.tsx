import { useRef } from "react";
import type { Slide } from "../../../types/slide";
import type { SlideTheme } from "../../../lib/premiumSlideTheme";
import { SLIDE_PALETTES } from "../../../lib/premiumSlideTheme";
import { SLIDE_PADDING } from "./layouts/typeScale";
import SlideLayout from "./SlideLayout";
import { useShrinkToFit } from "../../../hooks/useShrinkToFit";

export type SlideContext = "grid" | "fullscreen" | "pdf";
type Props = { slide: Slide; index: number; total: number; context: SlideContext; slideTheme?: SlideTheme };

// The 3D-depth slide shell every deck slide shares: the active slideTheme's palette, a hover tilt
// with a mouse-tracked sheen, and a background/content split for physical depth. Body content is
// delegated to SlideLayout. The "pdf" context drops every perspective/3D transform below, since
// html2canvas-pro can't rasterize a 3D rendering context the way the browser renders it live.
export default function SlideCard({ slide, index, total, context, slideTheme = "dark" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isPdf = context === "pdf";
  useShrinkToFit(contentRef, [slide]); // shrinks content that overflows the card's fixed height
  const palette = SLIDE_PALETTES[slideTheme];
  const isProblem = slide.layoutType === "problem";
  const background = isProblem
    ? slideTheme === "dark"
      ? "radial-gradient(ellipse at 50% 0%, #1a0000, #0a0a0a)"
      : "#fff8f8"
    : palette.background;

  // Moves the sheen highlight to the pointer via a CSS custom property, avoiding a re-render per pixel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  // Tilts the card toward the viewer on hover, settling flat again on leave
  const handleMouseEnter = () => ref.current?.style.setProperty("--tilt", "1");
  const handleMouseLeave = () => ref.current?.style.setProperty("--tilt", "0");

  return (
    <div style={isPdf ? undefined : { perspective: 1000 }}>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative flex aspect-video h-full w-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 ease-out ${
          slideTheme === "light" ? "border border-gray-100 shadow-2xl" : ""
        }`}
        style={{
          background,
          transformStyle: isPdf ? undefined : "preserve-3d",
          transform: isPdf
            ? undefined
            : "rotateX(calc(var(--tilt, 0) * 2deg)) rotateY(calc(var(--tilt, 0) * 4deg)) scale(calc(1 + var(--tilt, 0) * 0.01))",
        }}
      >
        <div
          ref={contentRef}
          className={`relative flex min-h-0 flex-1 flex-col ${SLIDE_PADDING}`}
          style={{ transform: `${isPdf ? "" : "translateZ(20px) "}scale(var(--fit-scale, 1))`, transformOrigin: "top left" }}
        >
          <SlideLayout slide={slide} context={context} slideTheme={slideTheme} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.05), transparent 60%)" }}
        />
        <span className="absolute bottom-4 right-6 text-xs font-semibold" style={{ color: palette.footer }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="absolute bottom-4 left-6 text-[10px] font-bold uppercase tracking-widest" style={{ color: palette.footer }}>
          Pitchr
        </span>
      </div>
    </div>
  );
}
