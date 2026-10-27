import { desc, eq } from "drizzle-orm";

import { jobRuns, type JobRunRow } from "@/db/schema";
import { getDb } from "@/lib/db";

export const INVOICE_REMINDERS_JOB = "invoice-reminders";

export async function recordJobRun(name: string, result: Record<string, unknown>) {
  await getDb().insert(jobRuns).values({ name, result });
}

/** A daily job is overdue once its last run is older than a day plus Hobby's one-hour window. */
export function isStaleDailyRun(run: Pick<JobRunRow, "ranAt"> | null, maxHours = 26): boolean {
  return !run || Date.now() - run.ranAt.getTime() > maxHours * 3_600_000;
}

export async function lastJobRun(name: string): Promise<JobRunRow | null> {
  const [row] = await getDb()
    .select()
    .from(jobRuns)
    .where(eq(jobRuns.name, name))
    .orderBy(desc(jobRuns.ranAt))
    .limit(1);
  return row ?? null;
}
