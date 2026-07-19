import Button from "../../Button";

type Props = { section: number; isLast: boolean; isGenerating: boolean; onBack: () => void; onNext: () => void; onGenerate: () => void };

// Back / Next / Generate My Card footer controls shared by every quiz section
export default function QuizNav({ section, isLast, isGenerating, onBack, onNext, onGenerate }: Props) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        onClick={onBack}
        disabled={section === 0}
        className="min-h-11 text-sm font-semibold text-white/60 transition hover:text-white disabled:opacity-30"
      >
        Back
      </button>
      <Button onClick={isLast ? onGenerate : onNext} disabled={isGenerating}>
        {isGenerating ? "Forging…" : isLast ? "Generate My Card" : "Next"}
      </Button>
    </div>
  );
}
