import type { AnswerReviewItem } from "../../types/pitcherator";

type Props = { item: AnswerReviewItem; index: number };

// One question's side-by-side comparison: the founder's actual answer in a red box labeled "Your
// Answer", a structure/clarity-only rewrite of that same answer in a green box labeled "Stronger
// Version", and a one-line note on what specifically was wrong with the original.
export default function AnswerComparisonCard({ item, index }: Props) {
  return (
    <div className="flex w-full flex-col gap-2 text-left">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Question {index + 1}</p>
      <p className="text-sm font-semibold text-white">{item.question}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">Your Answer</p>
          <p className="mt-2 text-sm leading-relaxed text-white">{item.answer || "(no answer given)"}</p>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Stronger Version</p>
          <p className="mt-2 text-sm leading-relaxed text-white">{item.corrected}</p>
        </div>
      </div>
      {item.note && <p className="text-xs italic text-white/40">{item.note}</p>}
    </div>
  );
}
