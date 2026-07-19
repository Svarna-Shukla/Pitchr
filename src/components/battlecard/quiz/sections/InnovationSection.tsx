import type { QuizAnswers } from "../../../../types/battleCard";
import TextAreaField from "../fields/TextAreaField";
import OptionGrid from "../fields/OptionGrid";

type Props = { answers: QuizAnswers; setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void };

// Section 2 — INNOVATION stat questions
export default function InnovationSection({ answers, setField }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <TextAreaField
        label="What makes your product different from everything that exists right now?"
        value={answers.differentiation}
        onChange={(v) => setField("differentiation", v)}
      />
      <OptionGrid
        label="Has anyone built this exact thing before?"
        value={answers.builtBefore}
        options={["Yes", "Somewhat", "No"]}
        columns={2}
        onChange={(v) => setField("builtBefore", v as QuizAnswers["builtBefore"])}
      />
      <OptionGrid
        label="How hard is it to copy what you built?"
        value={answers.copyDifficulty}
        options={["Very Easy", "Somewhat Easy", "Hard", "Nearly Impossible"]}
        onChange={(v) => setField("copyDifficulty", v as QuizAnswers["copyDifficulty"])}
      />
      <OptionGrid
        label="Did you solve an old problem in a new way, or a completely new problem?"
        value={answers.problemType}
        options={["Old problem, new way", "Completely new problem"]}
        columns={2}
        onChange={(v) => setField("problemType", v as QuizAnswers["problemType"])}
      />
    </div>
  );
}
