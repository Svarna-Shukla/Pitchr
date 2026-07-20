import { useLayoutEffect, type RefObject } from "react";

const MAX_REDUCTIONS = 3;
const SHRINK_FACTOR = 0.9;

// After each render, shrinks a slide's content to fit its fixed-height box: if the content
// overflows, scales it down by 10% (via the --fit-scale CSS var SlideCard's content wrapper
// consumes) up to 3 times. If it's still overflowing after every reduction, truncates the last
// [data-fit-bullet] element as a last resort so nothing ever gets hard-clipped mid-line.
export function useShrinkToFit(ref: RefObject<HTMLElement | null>, deps: unknown[]) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--fit-scale", "1");

    let scale = 1;
    for (let i = 0; i < MAX_REDUCTIONS && el.scrollHeight > el.clientHeight; i++) {
      scale *= SHRINK_FACTOR;
      el.style.setProperty("--fit-scale", String(scale));
    }

    if (el.scrollHeight > el.clientHeight) {
      const bullets = el.querySelectorAll<HTMLElement>("[data-fit-bullet]");
      const last = bullets[bullets.length - 1];
      const text = last?.textContent;
      if (last && text && text.length > 1) {
        last.textContent = `${text.slice(0, -1).trimEnd()}…`;
      }
    }
  }, deps);
}
