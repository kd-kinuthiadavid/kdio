import type { JobRunRow } from "@/db/schema";
import { formatDateTime } from "@/lib/documents/dates";
import { stageLabel, type ReminderStage } from "@/lib/documents/reminders";
import { cn } from "@/lib/utils";

/** When the automatic reminder job last ran and what it did; warns when it looks stuck. */
export function ReminderRunNotice({ run, stale }: { run: JobRunRow | null; stale: boolean }) {
  const r = (run?.result ?? {}) as {
    dryRun?: boolean;
    due?: number;
    sent?: number;
    failed?: string[];
  };
  const outcome = !run
    ? null
    : r.dryRun
      ? `dry run, ${r.due ?? 0} due`
      : `sent ${r.sent ?? 0}${r.failed?.length ? `, ${r.failed.length} failed` : ""}`;
  return (
    <p
      className={cn(
        "text-xs",
        stale || r.failed?.length ? "font-medium text-danger" : "text-muted-foreground"
      )}
    >
      {run
        ? `Automatic reminders last ran ${formatDateTime(run.ranAt)} (${outcome}).`
        : "Automatic reminders haven't run yet."}
      {stale ? " No run in over a day: check the cron job, or send reminders by hand." : null}
    </p>
  );
}

/**
 * Reminder state for an invoice. A reminder still pending after today's
 * automatic run means that run failed, skipped it, or sending is switched off.
 */
export function ReminderStatus({
  paused,
  pendingStage,
  ranToday,
  className,
}: {
  paused: boolean;
  pendingStage: ReminderStage | null;
  /** The automatic reminder job has already run today */
  ranToday: boolean;
  className?: string;
}) {
  if (!paused && !pendingStage) return null;
  const notSent = !paused && ranToday;
  return (
    <span
      title={pendingStage && !paused ? `${stageLabel(pendingStage)} reminder` : undefined}
      className={cn(
        "text-xs font-medium",
        notSent ? "text-danger" : "text-muted-foreground",
        className
      )}
    >
      {paused ? "Reminders paused" : notSent ? "Reminder not sent" : "Reminder due today"}
    </span>
  );
}
