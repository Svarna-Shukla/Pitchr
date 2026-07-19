import { useState } from "react";
import type { Theme } from "../../hooks/useTheme";
import type { FounderKit, FounderKitOutputKey } from "../../types/founderKit";
import { FOUNDER_KIT_OUTPUTS } from "../../types/founderKit";
import FounderKitCard from "./FounderKitCard";
import FounderKitChecklist from "./FounderKitChecklist";
import FounderKitSkeleton from "./FounderKitSkeleton";

type Props = { founderKit: FounderKit | null; isGenerating: boolean; failed: boolean; theme: Theme };

// Maps a checklist key to its {label, content} pair, given a generated kit — flattens the nested
// elevator-pitch and SWOT fields into the same per-card shape every other output already uses
function cardFor(key: FounderKitOutputKey, kit: FounderKit): { label: string; content: string | string[] } {
  const label = FOUNDER_KIT_OUTPUTS.find((o) => o.key === key)!.label;
  switch (key) {
    case "elevatorFifteen":
      return { label, content: kit.elevatorPitch.fifteenSec };
    case "elevatorThirty":
      return { label, content: kit.elevatorPitch.thirtySec };
    case "elevatorSixty":
      return { label, content: kit.elevatorPitch.sixtySec };
    case "swot":
      return {
        label,
        content: [
          `Strengths: ${kit.swot.strengths.join("; ")}`,
          `Weaknesses: ${kit.swot.weaknesses.join("; ")}`,
          `Opportunities: ${kit.swot.opportunities.join("; ")}`,
          `Threats: ${kit.swot.threats.join("; ")}`,
        ],
      };
    default:
      return { label, content: kit[key] as string | string[] };
  }
}

// Renders the generated Founder Kit documents in a responsive grid (filtered by the checklist above
// it), or a loading/failure/empty state
export default function FounderKitPanel({ founderKit, isGenerating, failed, theme }: Props) {
  const [selected, setSelected] = useState<Set<FounderKitOutputKey>>(new Set(FOUNDER_KIT_OUTPUTS.map((o) => o.key)));
  const isDark = theme === "dark";

  // Flips one output on/off in the checklist
  const toggle = (key: FounderKitOutputKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (isGenerating) return <FounderKitSkeleton />;
  if (failed) return <p className="text-sm text-red-400">Generation failed — try again.</p>;
  if (!founderKit) {
    return (
      <p className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>
        Type or paste your pitch above, then hit Generate Founder Kit.
      </p>
    );
  }

  return (
    <>
      <FounderKitChecklist selected={selected} onToggle={toggle} theme={theme} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FOUNDER_KIT_OUTPUTS.filter((o) => selected.has(o.key)).map((o) => {
          const { label, content } = cardFor(o.key, founderKit);
          return <FounderKitCard key={o.key} label={label} content={content} theme={theme} />;
        })}
      </div>
    </>
  );
}
