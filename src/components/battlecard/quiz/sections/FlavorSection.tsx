import type { QuizAnswers } from "../../../../types/battleCard";
import TextAreaField from "../fields/TextAreaField";

type Props = { answers: QuizAnswers; setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void };

// Section 6 — the card's flavour text: weakness tag and special ability
export default function FlavorSection({ answers, setField }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <TextAreaField
        label="What is your company's biggest weakness right now?"
        value={answers.weaknessRaw}
        onChange={(v) => setField("weaknessRaw", v)}
      />
      <TextAreaField
        label="What would make this a billion dollar company?"
        value={answers.billionDollarPath}
        onChange={(v) => setField("billionDollarPath", v)}
      />
    </div>
  );
}
