export type ThreatLevel = "low" | "medium" | "high";

export type Competitor = {
  name: string;
  whatTheyDo: string;
  weakness: string;
  threat: ThreatLevel;
};

// competitor threat level analysis