import { and, eq, gt, isNotNull, isNull, notExists, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

import { assessmentSubmissions } from "@/db/schema";
import { signResumeJwt } from "@/lib/assessment/resume-jwt";
import { sendResumeNudgeEmail } from "@/lib/email/send-assessment";
import { getDb } from "@/lib/db";
import { recordJobRun } from "@/lib/jobs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const other = alias(assessmentSubmissions, "other");
  const rows = await db
    .select()
    .from(assessmentSubmissions)
    .where(
      and(
        eq(assessmentSubmissions.status, "draft"),
        isNotNull(assessmentSubmissions.email),
        isNull(assessmentSubmissions.dropoffEmailSentAt),
        sql`${assessmentSubmissions.lastActivityAt} < now() - interval '2 hours'`,
        // Skip drafts superseded by a completed or newer submission from the same email
        notExists(
          db
            .select({ id: other.id })
            .from(other)
            .where(
              and(
                sql`lower(${other.email}) = lower(${assessmentSubmissions.email})`,
                or(
                  eq(other.status, "completed"),
                  gt(other.createdAt, assessmentSubmissions.createdAt)
                )
              )
            )
        )
      )
    )
    .limit(50);

  let sent = 0;
  for (const row of rows) {
    if (!row.email) continue;
    try {
      const jwt = await signResumeJwt({
        assessmentId: row.id,
        jti: row.resumeJti,
        issuedAt: new Date(row.createdAt as string | Date),
      });
      await sendResumeNudgeEmail({
        submissionId: row.id,
        to: row.email,
        locale: row.locale,
        resumeParam: jwt,
      });
      await db
        .update(assessmentSubmissions)
        .set({ dropoffEmailSentAt: new Date(), updatedAt: new Date() })
        .where(eq(assessmentSubmissions.id, row.id));
      sent += 1;
    } catch (e) {
      console.error("cron nudge failed", row.id, e);
    }
  }

  await recordJobRun("assessment-nudges", { processed: rows.length, sent });
  return NextResponse.json({ ok: true, processed: rows.length, sent });
}
