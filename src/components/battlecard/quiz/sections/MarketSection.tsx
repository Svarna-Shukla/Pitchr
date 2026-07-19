import type { QuizAnswers } from "../../../../types/battleCard";
import TextField from "../fields/TextField";
import OptionGrid from "../fields/OptionGrid";

type Props = { answers: QuizAnswers; setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void };

// Section 3 — MARKET stat questions
export default function MarketSection({ answers, setField }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <OptionGrid
        label="How big is your target market?"
        value={answers.marketSize}
        options={["Under $1B", "$1B–$10B", "$10B–$100B", "$100B+"]}
        onChange={(v) => setField("marketSize", v as QuizAnswers["marketSize"])}
      />
      <OptionGrid
        label="How fast is this market growing?"
        value={answers.marketGrowth}
        options={["Shrinking", "Flat", "Growing", "Exploding"]}
        onChange={(v) => setField("marketGrowth", v as QuizAnswers["marketGrowth"])}
      />
      <TextField
        label="Describe your ideal customer in one sentence"
        value={answers.idealCustomer}
        onChange={(v) => setField("idealCustomer", v)}
        placeholder="A 30-something who..."
      />
      <OptionGrid
        label="How many people genuinely have this problem right now?"
        value={answers.problemReach}
        options={["Thousands", "Hundreds of thousands", "Millions", "Hundreds of millions"]}
        onChange={(v) => setField("problemReach", v as QuizAnswers["problemReach"])}
      />
    </div>
  );
}
