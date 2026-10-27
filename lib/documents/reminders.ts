export const REMINDER_STAGES = [
  { stage: "upcoming", offsetDays: -3, label: "Before due date" },
  { stage: "due", offsetDays: 0, label: "Due date" },
  { stage: "overdue_1", offsetDays: 3, label: "First overdue" },
  { stage: "overdue_2", offsetDays: 10, label: "Second overdue" },
  { stage: "final", offsetDays: 21, label: "Final" },
] as const;

export type ReminderStage = (typeof REMINDER_STAGES)[number]["stage"];
/** What a `reminder_sent` event records: a scheduled stage, or `manual` when none was due. */
export type ReminderEventStage = ReminderStage | "manual";

/** Minimum whole days between any two emails about the same invoice. */
export const MIN_GAP_DAYS = 2;
/** Shorter payment terms skip the heads-up, which would land right after the invoice. */
const UPCOMING_MIN_TERMS_DAYS = 7;

/** Whole days from one ISO date to another; negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const ms = Date.parse(`${to.slice(0, 10)}T00:00:00Z`) - Date.parse(`${from.slice(0, 10)}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function stageLabel(stage: string): string {
  if (stage === "manual") return "Manual";
  return REMINDER_STAGES.find((s) => s.stage === stage)?.label ?? stage;
}

export type ReminderInput = {
  issueDate?: string;
  dueDate?: string;
  outstandingMinor: number;
  paused: boolean;
  /** Stages already recorded on `reminder_sent` events */
  sentStages: ReadonlySet<string>;
  /** Date of the latest `sent` or `reminder_sent` event, in the business time zone */
  lastContactOn: string | null;
  today: string;
};

/**
 * The reminder an invoice should get today, if any. Only the latest stage
 * reached is considered, so a missed day catches up with one email rather
 * than a burst of the stages in between.
 */
export function pendingReminderStage(input: ReminderInput): ReminderStage | null {
  const { issueDate, dueDate, outstandingMinor, paused, sentStages, lastContactOn, today } = input;
  if (!dueDate || outstandingMinor <= 0 || paused) return null;

  const offset = daysBetween(dueDate, today);
  const shortTerms = issueDate ? daysBetween(issueDate, dueDate) < UPCOMING_MIN_TERMS_DAYS : false;
  let index = -1;
  REMINDER_STAGES.forEach((s, i) => {
    if (s.offsetDays > offset) return;
    if (s.stage === "upcoming" && shortTerms) return;
    index = i;
  });
  if (index < 0) return null;
  if (REMINDER_STAGES.slice(index).some((s) => sentStages.has(s.stage))) return null;
  if (lastContactOn && daysBetween(lastContactOn, today) < MIN_GAP_DAYS) return null;
  return REMINDER_STAGES[index].stage;
}

export type ReminderFacts = {
  number: string;
  /** Formatted outstanding amount */
  outstanding: string;
  /** Formatted due date */
  dueOn: string;
  /** Days past the due date; negative before it */
  daysPastDue: number;
};

const plural = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

/** Subject and opening line for a reminder email. */
export function stageCopy(
  stage: ReminderEventStage,
  f: ReminderFacts
): { subject: string; intro: string } {
  const d = f.daysPastDue;
  const status = d < 0 ? `is due on ${f.dueOn}` : d === 0 ? "is due today" : `is ${plural(d)} overdue`;
  const tone: ReminderStage =
    stage !== "manual" ? stage : d < 0 ? "upcoming" : d === 0 ? "due" : "overdue_1";

  const intros: Record<ReminderStage, string> = {
    upcoming: `A friendly reminder that invoice ${f.number} for ${f.outstanding} is due on ${f.dueOn}.`,
    due: `A quick reminder that invoice ${f.number} for ${f.outstanding} is due today.`,
    overdue_1: `Invoice ${f.number} was due on ${f.dueOn} and ${f.outstanding} is still outstanding. If you've already paid, thank you, and please disregard this note.`,
    overdue_2: `Invoice ${f.number} is now ${plural(d)} past its due date of ${f.dueOn}, with ${f.outstanding} outstanding. Please arrange payment at your earliest convenience, or get in touch if anything is holding it up.`,
    final: `This is a final reminder that invoice ${f.number} is ${plural(d)} overdue, with ${f.outstanding} outstanding since ${f.dueOn}. Please arrange payment or get in touch so we can agree next steps.`,
  };

  return {
    subject: `${tone === "final" ? "Final reminder" : "Reminder"}: Invoice ${f.number} ${status}`,
    intro: intros[tone],
  };
}
