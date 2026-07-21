import { useLayoutEffect, useRef, useState } from "react";

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

type Props = { children: React.ReactNode; className?: string };

// Renders children inside a fixed 1920x1080 canvas, then uniformly CSS-scales that canvas to fit
// whatever real box the parent provides. This is what guarantees byte-identical typography and
// alignment across the grid thumbnail, fullscreen Present Mode, and PDF export: content is always
// laid out at the same literal pixel size, only the outer scale factor differs (and CSS transforms
// never affect layout geometry, so measurements like useShrinkToFit's stay consistent everywhere).
export function SlideViewport({ children, className = "" }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const measure = () => {
      // offsetWidth/offsetHeight (unlike getBoundingClientRect) reflect the untransformed layout
      // box, so this stays correct even while an ancestor (e.g. PresentationSlide's or
      // DeckSlideCard's entrance animation) is mid-transform — getBoundingClientRect briefly
      // reports a near-zero rect during those animations, which used to get cached as the scale
      // forever since ResizeObserver never fires again for a transform-only change upstream.
      const { offsetWidth: width, offsetHeight: height } = outer;
      if (width > 0 && height > 0) setScale(Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative h-full w-full overflow-hidden">
      <div
        className={`absolute left-1/2 top-1/2 h-[1080px] w-[1920px] shrink-0 ${className}`}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
