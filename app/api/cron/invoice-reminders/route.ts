import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

import { todayIso } from "@/lib/documents/dates";
import { findDueReminders } from "@/lib/documents/reminders-data";
import { sendReminderEmail } from "@/lib/email/send-reminder";
import { INVOICE_REMINDERS_JOB, recordJobRun } from "@/lib/jobs";

const MAX_PER_RUN = 50;

/**
 * Daily payment reminders. Runs dry (lists what would be sent) with
 * `?dryRun=1` or while INVOICE_REMINDERS_ENABLED isn't "true".
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = process.env.INVOICE_REMINDERS_ENABLED === "true";
  const dryRun = !enabled || new URL(request.url).searchParams.get("dryRun") === "1";
  const today = todayIso();
  const due = await findDueReminders(today, MAX_PER_RUN);

  if (dryRun) {
    const result = {
      dryRun: true,
      enabled,
      today,
      due: due.length,
      reminders: due.map(({ id, number, stage, to }) => ({ id, number, stage, to })),
    };
    await recordJobRun(INVOICE_REMINDERS_JOB, result);
    return NextResponse.json({ ok: true, ...result });
  }

  const cc = process.env.NOTIFY_EMAIL ?? "";
  let sent = 0;
  const failed: string[] = [];
  const skipped: string[] = [];
  for (const reminder of due) {
    if (!reminder.to.length) {
      skipped.push(reminder.number);
      continue;
    }
    try {
      await sendReminderEmail(
        reminder.id,
        { to: reminder.to.join(", "), cc, stage: reminder.stage, trigger: "auto" },
        "cron"
      );
      sent += 1;
    } catch (e) {
      console.error("cron reminder failed", reminder.id, e);
      Sentry.captureException(e, { extra: { documentId: reminder.id, stage: reminder.stage } });
      failed.push(reminder.number);
    }
  }

  const result = { dryRun: false, enabled, today, due: due.length, sent, failed, skipped };
  await recordJobRun(INVOICE_REMINDERS_JOB, result);
  return NextResponse.json({ ok: true, ...result });
}
