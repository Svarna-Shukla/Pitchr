import type { useBattleCard } from "../../hooks/useBattleCard";
import BattleCardStepFields from "./BattleCardStepFields";
import type { Theme } from "../../hooks/useTheme";
import Button from "../Button";

type Props = { battleCard: ReturnType<typeof useBattleCard>; theme: Theme };

const STEP_TITLES = ["Company Basics", "Traction", "Team", "Advantage", "Funding"];

// 5-step form collecting the founder's answers before generating the Pokemon-style cards
export default function BattleCardWizard({ battleCard, theme }: Props) {
  const { step, form, updateField, next, back, generate, isGenerating, failed } = battleCard;
  const isDark = theme === "dark";
  const isLast = step === STEP_TITLES.length - 1;

  return (
    <div
      className={`mx-auto w-full max-w-md rounded-2xl border p-6 ${
        isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white ring-1 ring-black/5"
      }`}
    >
      <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>
        Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step]}
      </p>
      <div className="mt-4">
        <BattleCardStepFields step={step} form={form} onChange={updateField} isDark={isDark} />
      </div>
      {failed && <p className="mt-3 text-sm text-red-400">Couldn't generate your cards — try again.</p>}
      <div className="mt-6 flex justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className={`text-sm font-semibold disabled:opacity-30 ${isDark ? "text-white/60" : "text-black/60"}`}
        >
          Back
        </button>
        <Button onClick={isLast ? generate : next} disabled={isGenerating}>
          {isGenerating ? "Generating…" : isLast ? "Generate Cards" : "Next"}
        </Button>
      </div>
    </div>
  );
}
