import type { ChallengeId, QuestionId, SectorId } from "./types";

export type QuestionOption<T extends string = string> = {
  id: T;
  /** Points toward total score (0–10 per question max in this model) */
  score: number;
};

export type AssessmentQuestion =
  | {
      id: QuestionId;
      block: "context" | "problem" | "readiness";
      type: "single";
      options: QuestionOption[];
    }
  | {
      id: QuestionId;
      block: "readiness";
      type: "scale";
      min: number;
      max: number;
      /** label keys under assessment.questions.* — optional for UI */
      minLabelKey: string;
      maxLabelKey: string;
    };

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "sector",
    block: "context",
    type: "single",
    options: [
      { id: "fintech", score: 10 },
      { id: "b2bSaas", score: 10 },
      { id: "legaltech", score: 10 },
      { id: "proptech", score: 10 },
      { id: "other", score: 4 },
    ],
  },
  {
    id: "role",
    block: "context",
    type: "single",
    options: [
      { id: "ctoEng", score: 10 },
      { id: "vpOps", score: 8 },
      { id: "founder", score: 9 },
      { id: "other", score: 5 },
    ],
  },
  {
    id: "challenge",
    block: "problem",
    type: "single",
    options: [
      { id: "integrationLegacy", score: 10 },
      { id: "secureRegulated", score: 10 },
      { id: "productAiNative", score: 10 },
      { id: "opsAutomation", score: 10 },
      { id: "infraCost", score: 10 },
      { id: "advisoryExec", score: 10 },
    ],
  },
  {
    id: "urgency",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "budgetSignal",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "timeline",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "teamMaturity",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "priorBurn",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "compliancePressure",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
  {
    id: "decisionAuthority",
    block: "readiness",
    type: "scale",
    min: 0,
    max: 10,
    minLabelKey: "scaleLow",
    maxLabelKey: "scaleHigh",
  },
];

export function isCompleteAnswers(
  raw: Record<string, unknown>
): raw is Record<string, string | number> {
  for (const q of ASSESSMENT_QUESTIONS) {
    const v = raw[q.id];
    if (v === undefined || v === null) return false;
    if (q.type === "scale") {
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n) || n < q.min || n > q.max) return false;
    } else {
      if (typeof v !== "string") return false;
      if (!q.options.some((o) => o.id === v)) return false;
    }
  }
  return true;
}

export function normalizeSector(value: string): SectorId | null {
  if (value === "fintech" || value === "b2bSaas" || value === "legaltech" || value === "proptech" || value === "other") {
    return value;
  }
  return null;
}

export function normalizeChallenge(value: string): ChallengeId | null {
  const ids: ChallengeId[] = [
    "integrationLegacy",
    "secureRegulated",
    "productAiNative",
    "opsAutomation",
    "infraCost",
    "advisoryExec",
  ];
  return ids.includes(value as ChallengeId) ? (value as ChallengeId) : null;
}
