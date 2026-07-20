import { useLayoutEffect, type RefObject } from "react";

const MIN_SCALE = 0.5;

// After each render, shrinks a slide's content to fit its fixed-height box: if the content
// overflows, scales it down by exactly the ratio needed to fit (via the --fit-scale CSS var
// SlideCard's content wrapper consumes), floored at MIN_SCALE so text never becomes illegible.
// scrollHeight/clientHeight are measured once, before any scale is applied, since CSS transform
// (unlike width/height) never affects layout geometry — an earlier version of this hook re-checked
// the same two numbers after each of several blind 10% reductions and found them unchanged every
// time, so it either shrank exactly 3 steps regardless of how much was actually needed, or (for
// layouts like HeroLayout with no [data-fit-bullet] elements) left long titles overflowing the
// card with no fallback at all. If even MIN_SCALE isn't enough, truncates the last
// [data-fit-bullet] element as a last resort so nothing ever gets hard-clipped mid-line.
export function useShrinkToFit(ref: RefObject<HTMLElement | null>, deps: unknown[]) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--fit-scale", "1");

    const { scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) return;

    const scale = Math.max(MIN_SCALE, clientHeight / scrollHeight);
    el.style.setProperty("--fit-scale", String(scale));

    if (scale <= MIN_SCALE) {
      const bullets = el.querySelectorAll<HTMLElement>("[data-fit-bullet]");
      const last = bullets[bullets.length - 1];
      const text = last?.textContent;
      if (last && text && text.length > 1) {
        last.textContent = `${text.slice(0, -1).trimEnd()}…`;
      }
    }
  }, deps);
}
