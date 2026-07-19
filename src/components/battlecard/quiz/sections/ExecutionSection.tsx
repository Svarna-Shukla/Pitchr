import type { QuizAnswers } from "../../../../types/battleCard";
import OptionGrid from "../fields/OptionGrid";

type Props = { answers: QuizAnswers; setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void };

// Section 4 — EXECUTION stat questions
export default function ExecutionSection({ answers, setField }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <OptionGrid
        label="How long have you been building?"
        value={answers.buildingTime}
        options={["Just started", "Under 6 months", "6–18 months", "18 months+"]}
        onChange={(v) => setField("buildingTime", v as QuizAnswers["buildingTime"])}
      />
      <OptionGrid
        label="How many paying customers or active users do you have right now?"
        value={answers.activeUsers}
        options={["None yet", "1–10", "10–100", "100–1,000", "1,000+"]}
        onChange={(v) => setField("activeUsers", v as QuizAnswers["activeUsers"])}
      />
      <OptionGrid
        label="Monthly revenue"
        value={answers.monthlyRevenue}
        options={["Pre-revenue", "Under $1k", "$1k–$10k", "$10k–$100k", "$100k+"]}
        onChange={(v) => setField("monthlyRevenue", v as QuizAnswers["monthlyRevenue"])}
      />
      <OptionGrid
        label="Your team's single strongest skill"
        value={answers.strongestSkill}
        options={["Tech", "Sales", "Domain Expertise", "Operations", "Design"]}
        onChange={(v) => setField("strongestSkill", v as QuizAnswers["strongestSkill"])}
      />
    </div>
  );
}
