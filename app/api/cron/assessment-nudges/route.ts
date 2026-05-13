import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { assessmentSubmissions } from "@/db/schema";
import { signResumeJwt } from "@/lib/assessment/resume-jwt";
import { sendResumeNudgeEmail } from "@/lib/email/send-assessment";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getDb()
    .select()
    .from(assessmentSubmissions)
    .where(
      and(
        eq(assessmentSubmissions.status, "draft"),
        isNotNull(assessmentSubmissions.email),
        isNull(assessmentSubmissions.dropoffEmailSentAt),
        sql`${assessmentSubmissions.lastActivityAt} < now() - interval '2 hours'`
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
        to: row.email,
        locale: row.locale,
        resumeParam: jwt,
      });
      await getDb()
        .update(assessmentSubmissions)
        .set({ dropoffEmailSentAt: new Date(), updatedAt: new Date() })
        .where(eq(assessmentSubmissions.id, row.id));
      sent += 1;
    } catch (e) {
      console.error("cron nudge failed", row.id, e);
    }
  }

  return NextResponse.json({ ok: true, processed: rows.length, sent });
}
