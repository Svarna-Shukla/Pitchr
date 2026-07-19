import type { QuizAnswers } from "../../../../types/battleCard";
import TextAreaField from "../fields/TextAreaField";
import MultiSelectGrid from "../fields/MultiSelectGrid";

type Props = {
  answers: QuizAnswers;
  setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void;
  toggleMoat: (moat: string) => void;
};

const MOATS = ["Patents", "Exclusive Contracts", "Proprietary Data", "Network Effects"];

// Section 5 — DEFENSIBILITY stat questions
export default function DefensibilitySection({ answers, setField, toggleMoat }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <TextAreaField
        label="What is your single biggest competitive advantage?"
        value={answers.competitiveAdvantage}
        onChange={(v) => setField("competitiveAdvantage", v)}
      />
      <MultiSelectGrid label="Do you have any of these?" values={answers.moats} options={MOATS} onToggle={toggleMoat} />
      <TextAreaField
        label="If a well funded competitor copied you tomorrow, what would stop them from winning?"
        value={answers.copyDefense}
        onChange={(v) => setField("copyDefense", v)}
      />
      <TextAreaField
        label="What would take a competitor at least 1 year to replicate?"
        value={answers.yearToReplicate}
        onChange={(v) => setField("yearToReplicate", v)}
      />
    </div>
  );
}
