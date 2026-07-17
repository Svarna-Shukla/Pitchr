import type { FounderKit } from "../../types/founderKit";
import FounderKitCard from "./FounderKitCard";

type Props = { founderKit: FounderKit | null; isGenerating: boolean; failed: boolean };

// Renders the generated Founder Kit documents, or a loading/failure state while it's being produced
export default function FounderKitPanel({ founderKit, isGenerating, failed }: Props) {
  if (isGenerating) return <p className="text-sm text-white/50">Generating your founder kit…</p>;
  if (failed) return <p className="text-sm text-red-400">Generation failed — try reopening this tab.</p>;
  if (!founderKit) return null;

  return (
    <div className="flex flex-col gap-3">
      <FounderKitCard label="One-liner" content={founderKit.oneLiner} />
      <FounderKitCard label="Elevator pitch — 15 sec" content={founderKit.elevatorPitch.fifteenSec} />
      <FounderKitCard label="Elevator pitch — 30 sec" content={founderKit.elevatorPitch.thirtySec} />
      <FounderKitCard label="Elevator pitch — 60 sec" content={founderKit.elevatorPitch.sixtySec} />
      <FounderKitCard label="Problem statement" content={founderKit.problemStatement} />
      <FounderKitCard label="Target customer" content={founderKit.targetCustomer} />
      <FounderKitCard label="Value proposition" content={founderKit.valueProposition} />
    </div>
  );
}
