import type { LayoutProps } from "../SlideLayout";
import { BULLET_CLASS, TITLE_CLASS } from "./typeScale";

// Split layout: title on the left half, the stat (or first bullet, large) on the right half, a
// thin orange vertical line dividing the two — the always-safe fallback layout for any slide type
export default function SplitLayout({ slide, context }: LayoutProps) {
  const rightContent = slide.stat ?? slide.bulletPoints[0] ?? "";

  return (
    <div className="flex h-full flex-1 items-center gap-8">
      <div className="flex flex-1 flex-col justify-center">
        <h2 className={`font-display font-bold leading-tight text-white ${TITLE_CLASS[context]}`}>{slide.title}</h2>
        {slide.bulletPoints.length > 1 && (
          <ul className="mt-6 space-y-3">
            {slide.bulletPoints.slice(1).map((b, i) => (
              <li key={i} className={`flex items-start gap-3 leading-relaxed text-white/80 ${BULLET_CLASS[context]}`}>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-[2px]" style={{ background: slide.accentColor }} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="h-full w-px shrink-0" style={{ background: slide.accentColor }} />
      <div className="flex flex-1 items-center justify-center text-center">
        <p className="font-display text-3xl font-bold leading-tight" style={{ color: slide.accentColor }}>
          {rightContent}
        </p>
      </div>
    </div>
  );
}
