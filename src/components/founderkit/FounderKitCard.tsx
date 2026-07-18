import CopyButton from "../CopyButton";
import TiltCard from "../TiltCard";
import type { Theme } from "../../hooks/useTheme";

type Props = { label: string; content: string | string[]; theme: Theme };

// Renders one Founder Kit document as a labelled card with a copy button
export default function FounderKitCard({ label, content, theme }: Props) {
  const text = Array.isArray(content) ? content.join("\n") : content;
  const isDark = theme === "dark";

  return (
    <TiltCard
      maxTilt={4}
      className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-[#0f0f1a]" : "border-black/10 bg-white ring-1 ring-black/5"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-accent)]">{label}</h4>
        <CopyButton getText={() => text} />
      </div>
      {Array.isArray(content) ? (
        <ul className="mt-3 space-y-2">
          {content.map((line, i) => (
            <li key={i} className={`flex gap-2 text-sm ${isDark ? "text-white/80" : "text-black/70"}`}>
              <span className="text-[color:var(--color-accent)]">-</span>
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${isDark ? "text-white/80" : "text-black/70"}`}>{content}</p>
      )}
    </TiltCard>
  );
}
