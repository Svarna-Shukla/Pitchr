export type FounderKit = {
  oneLiner: string;
  elevatorPitch: {
    fifteenSec: string;
    thirtySec: string;
    sixtySec: string;
  };
  problemStatement: string;
  targetCustomer: string;
  valueProposition: string[];
  gtmStrategy: string;
  validationQuestions: string[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  riskAssessment: string[];
  financialProjections: string[];
  landingPageCopy: string;
  investorEmail: string;
  pressRelease: string;
  linkedinAnnouncement: string;
  narrationScript: string;
};

// One entry per one of the 17 individually-selectable/displayed outputs — the 3 elevator pitch
// lengths are separate entries here even though they share one nested FounderKit field
export type FounderKitOutputKey =
  | "oneLiner"
  | "elevatorFifteen"
  | "elevatorThirty"
  | "elevatorSixty"
  | "problemStatement"
  | "valueProposition"
  | "targetCustomer"
  | "gtmStrategy"
  | "validationQuestions"
  | "swot"
  | "riskAssessment"
  | "financialProjections"
  | "landingPageCopy"
  | "investorEmail"
  | "pressRelease"
  | "linkedinAnnouncement"
  | "narrationScript";

export const FOUNDER_KIT_OUTPUTS: { key: FounderKitOutputKey; label: string }[] = [
  { key: "oneLiner", label: "One-liner pitch" },
  { key: "elevatorFifteen", label: "Elevator pitch — 15 sec" },
  { key: "elevatorThirty", label: "Elevator pitch — 30 sec" },
  { key: "elevatorSixty", label: "Elevator pitch — 60 sec" },
  { key: "problemStatement", label: "Problem statement" },
  { key: "valueProposition", label: "Value proposition" },
  { key: "targetCustomer", label: "Target customer profile" },
  { key: "gtmStrategy", label: "Go-to-market strategy" },
  { key: "validationQuestions", label: "Problem validation questions" },
  { key: "swot", label: "SWOT analysis" },
  { key: "riskAssessment", label: "Risk assessment" },
  { key: "financialProjections", label: "Financial projections skeleton" },
  { key: "landingPageCopy", label: "Landing page copy" },
  { key: "investorEmail", label: "Investor email draft" },
  { key: "pressRelease", label: "Press release" },
  { key: "linkedinAnnouncement", label: "LinkedIn announcement" },
  { key: "narrationScript", label: "Pitch narration script" },
];