/** Matches `services.items.*` keys in messages */
export const SERVICE_IDS = [
  "aiIntegration",
  "secureAi",
  "aiNative",
  "agenticOps",
  "mlopsRescue",
  "fractionalCto",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

export const TIER_BAND_IDS = [
  "strong",
  "good",
  "nurture",
  "notFit",
] as const;

export type TierBandId = (typeof TIER_BAND_IDS)[number];

export const SECTOR_IDS = [
  "fintech",
  "b2bSaas",
  "legaltech",
  "proptech",
  "other",
] as const;

export type SectorId = (typeof SECTOR_IDS)[number];

/** Primary pain — drives service recommendation */
export const CHALLENGE_IDS = [
  "integrationLegacy",
  "secureRegulated",
  "productAiNative",
  "opsAutomation",
  "infraCost",
  "advisoryExec",
] as const;

export type ChallengeId = (typeof CHALLENGE_IDS)[number];

export const QUESTION_IDS = [
  "sector",
  "role",
  "challenge",
  "urgency",
  "budgetSignal",
  "timeline",
  "teamMaturity",
  "priorBurn",
  "compliancePressure",
  "decisionAuthority",
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];

/** Answer payload stored in DB / sent from client (values are option ids or 0–10 scales) */
export type AssessmentAnswers = Partial<{
  sector: SectorId;
  role: "ctoEng" | "vpOps" | "founder" | "other";
  challenge: ChallengeId;
  urgency: number;
  budgetSignal: number;
  timeline: number;
  teamMaturity: number;
  priorBurn: number;
  compliancePressure: number;
  decisionAuthority: number;
}>;

export const ASSESSMENT_VERSION = 1 as const;
