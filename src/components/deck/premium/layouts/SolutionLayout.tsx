import type { LayoutProps } from "../SlideLayout";
import { BULLET_CLASS, TITLE_CLASS } from "./typeScale";

// Solution layout: orange title, clean left-aligned white bullets with an orange square marker
export default function SolutionLayout({ slide, context }: LayoutProps) {
  return (
    <div className="flex h-full flex-1 flex-col justify-center">
      <h2 className={`max-w-[80%] font-display font-bold leading-tight ${TITLE_CLASS[context]}`} style={{ color: slide.accentColor }}>
        {slide.title}
      </h2>
      <ul className="mt-6 space-y-3">
        {slide.bulletPoints.map((b, i) => (
          <li key={i} className={`flex items-start gap-3 leading-relaxed text-white ${BULLET_CLASS[context]}`}>
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px]" style={{ background: slide.accentColor }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
