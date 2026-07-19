import type { QuizAnswers } from "../../../../types/battleCard";
import TextField from "../fields/TextField";
import DropdownField from "../fields/DropdownField";
import BusinessTypeCards from "../fields/BusinessTypeCards";

type Props = { answers: QuizAnswers; setField: <K extends keyof QuizAnswers>(k: K, v: QuizAnswers[K]) => void };

const INDUSTRIES = ["Tech", "Healthcare", "Education", "Finance", "Retail", "Food", "Real Estate", "Other"];

// Section 1 — company identity: name, one-liner, industry, and business type
export default function IdentitySection({ answers, setField }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <TextField label="Company name" value={answers.companyName} onChange={(v) => setField("companyName", v)} placeholder="Acme Inc." />
      <TextField
        label="What does it do, in one sentence"
        value={answers.oneLiner}
        onChange={(v) => setField("oneLiner", v)}
        placeholder="We help X do Y without Z"
      />
      <DropdownField label="Industry" value={answers.industry} options={INDUSTRIES} onChange={(v) => setField("industry", v)} />
      <BusinessTypeCards value={answers.businessType} onChange={(v) => setField("businessType", v)} />
    </div>
  );
}
