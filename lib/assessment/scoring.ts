import type {
  AssessmentAnswers,
  ChallengeId,
  SectorId,
  ServiceId,
  TierBandId,
} from "./types";
import { ASSESSMENT_QUESTIONS } from "./questions";

export function scoreAnswers(answers: Record<string, unknown>): number {
  let total = 0;
  for (const q of ASSESSMENT_QUESTIONS) {
    const raw = answers[q.id];
    if (raw === undefined || raw === null) continue;
    if (q.type === "single") {
      const id = String(raw);
      const opt = q.options.find((o) => o.id === id);
      if (opt) total += opt.score;
    } else {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (Number.isFinite(n)) {
        const clamped = Math.min(q.max, Math.max(q.min, n));
        total += clamped;
      }
    }
  }
  return Math.round(total);
}

/**
 * Map challenge + sector to recommended service.
 * Challenge is primary; sector only nudges missing/ambiguous cases.
 */
export function routeService(answers: AssessmentAnswers): ServiceId {
  const { challenge, sector } = answers;
  switch (challenge) {
    case "integrationLegacy":
      return "aiIntegration";
    case "secureRegulated":
      return "secureAi";
    case "productAiNative":
      return "aiNative";
    case "opsAutomation":
      return "agenticOps";
    case "infraCost":
      return "mlopsRescue";
    case "advisoryExec":
      return "fractionalCto";
    default:
      break;
  }
  if (sector === "legaltech") return "secureAi";
  if (sector === "proptech") return "agenticOps";
  if (sector === "fintech") return "aiIntegration";
  return "aiNative";
}

export function tierFromScore(total: number): TierBandId {
  if (total >= 75) return "strong";
  if (total >= 50) return "good";
  if (total >= 30) return "nurture";
  return "notFit";
}

export function callOpenerLine(args: {
  tier: TierBandId;
  serviceId: ServiceId;
  total: number;
}): string {
  const svc = args.serviceId.replace(/([A-Z])/g, " $1").trim();
  return `I saw your assessment (${args.total}/100, ${args.tier} fit) — let's talk about ${svc} specifically.`;
}

/** Cal.com prefill: name optional; notes hold opener */
export function buildCalNotes(args: {
  email: string;
  tier: TierBandId;
  serviceId: ServiceId;
  total: number;
}): string {
  return [
    `Email: ${args.email}`,
    `Score: ${args.total}/100`,
    `Tier: ${args.tier}`,
    `Recommended service: ${args.serviceId}`,
    callOpenerLine(args),
  ].join("\n");
}

export function assertAnswersForScoring(
  answers: Record<string, unknown>
): AssessmentAnswers | null {
  const a: AssessmentAnswers = {};
  const sector = answers.sector;
  if (typeof sector !== "string") return null;
  const sectors: SectorId[] = [
    "fintech",
    "b2bSaas",
    "legaltech",
    "proptech",
    "other",
  ];
  if (!sectors.includes(sector as SectorId)) return null;
  a.sector = sector as SectorId;

  const role = answers.role;
  if (typeof role !== "string") return null;
  if (!["ctoEng", "vpOps", "founder", "other"].includes(role)) return null;
  a.role = role as AssessmentAnswers["role"];

  const challenge = answers.challenge;
  if (typeof challenge !== "string") return null;
  const challenges: ChallengeId[] = [
    "integrationLegacy",
    "secureRegulated",
    "productAiNative",
    "opsAutomation",
    "infraCost",
    "advisoryExec",
  ];
  if (!challenges.includes(challenge as ChallengeId)) return null;
  a.challenge = challenge as ChallengeId;

  for (const key of [
    "urgency",
    "budgetSignal",
    "timeline",
    "teamMaturity",
    "priorBurn",
    "compliancePressure",
    "decisionAuthority",
  ] as const) {
    const v = answers[key];
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n) || n < 0 || n > 10) return null;
    a[key] = n;
  }

  return a;
}
