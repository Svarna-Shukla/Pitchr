import type { VoiceDeliverySummary } from "../../../types/voice";

type Props = { summary: VoiceDeliverySummary };

// Two blunt, specific tips derived from whichever delivery weakness actually shows up in the numbers
// — no generic advice, just the two sharpest fixes for this founder's own filler and pace readouts
function buildTips(summary: VoiceDeliverySummary): string[] {
  const tips: string[] = [];
  tips.push(
    summary.totalFillerCount >= 3
      ? `Cut the "um"s and "like"s — you hit ${summary.totalFillerCount} filler words. Investors count them too.`
      : "Filler words are under control — keep answers just as tight under pressure."
  );
  if (summary.paceTag === "Too Fast") tips.push("Slow down. Racing through answers reads as nerves, not confidence.");
  else if (summary.paceTag === "Too Slow") tips.push("Pick up the pace — long pauses read as uncertainty in a live pitch.");
  else tips.push("Pace is in the investor-confidence zone — hold that rhythm on harder questions.");
  return tips;
}

export default function DeliveryTips({ summary }: Props) {
  return (
    <ul className="space-y-1.5 text-left">
      {buildTips(summary).map((tip, i) => (
        <li key={i} className="text-sm text-white/80">
          - {tip}
        </li>
      ))}
    </ul>
  );
}
