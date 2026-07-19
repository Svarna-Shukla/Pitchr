import type { LayoutProps } from "../SlideLayout";
import { BULLET_CLASS, TITLE_CLASS } from "./typeScale";

// Problem layout: white bold title, three orange-dash bullets, an optional stat pinned top-right —
// the very subtle dark-red background tint itself is applied one level up, in PremiumSlide's shell
export default function ProblemLayout({ slide, context }: LayoutProps) {
  return (
    <div className="relative flex h-full flex-1 flex-col justify-center">
      {slide.stat && (
        <span className="absolute right-0 top-0 font-display text-2xl font-bold" style={{ color: slide.accentColor }}>
          {slide.stat}
        </span>
      )}
      <h2 className={`max-w-[80%] font-display font-bold leading-tight text-white ${TITLE_CLASS[context]}`}>{slide.title}</h2>
      <ul className="mt-6 space-y-3">
        {slide.bulletPoints.map((b, i) => (
          <li key={i} className={`flex items-start gap-3 leading-relaxed text-white/80 ${BULLET_CLASS[context]}`}>
            <span className="mt-1 font-bold" style={{ color: slide.accentColor }}>
              —
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
