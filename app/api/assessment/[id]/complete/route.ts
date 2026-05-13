import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assessmentSubmissions } from "@/db/schema";
import { isCompleteAnswers } from "@/lib/assessment/questions";
import {
  assertAnswersForScoring,
  routeService,
  scoreAnswers,
  tierFromScore,
} from "@/lib/assessment/scoring";
import { verifyResumeJwt } from "@/lib/assessment/resume-jwt";
import { sendCompletionEmails } from "@/lib/email/send-assessment";
import { getDb } from "@/lib/db";
import { clientIp, rateLimitAssessment } from "@/lib/ratelimit";
import type { ServiceId, TierBandId } from "@/lib/assessment/types";

const bodySchema = z.object({
  token: z.string().min(10),
  answers: z.record(z.string(), z.union([z.string(), z.number()])),
});

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const ip = clientIp(request.headers);
  const { success } = await rateLimitAssessment(`complete:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const claims = await verifyResumeJwt(parsed.data.token);
  if (!claims || claims.assessmentId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const rows = await getDb()
    .select()
    .from(assessmentSubmissions)
    .where(eq(assessmentSubmissions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.resumeJti !== claims.jti) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (row.status === "completed") {
    return NextResponse.json({
      id: row.id,
      alreadyCompleted: true,
      totalScore: row.totalScore,
      tier: row.tier,
      serviceId: row.serviceId,
    });
  }

  if (!isCompleteAnswers(parsed.data.answers)) {
    return NextResponse.json({ error: "Incomplete answers" }, { status: 400 });
  }

  const scoredAnswers = assertAnswersForScoring(parsed.data.answers);
  if (!scoredAnswers) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const total = scoreAnswers(parsed.data.answers);
  const tier = tierFromScore(total);
  const serviceId = routeService(scoredAnswers);

  await getDb()
    .update(assessmentSubmissions)
    .set({
      status: "completed",
      answersJson: parsed.data.answers,
      totalScore: total,
      tier,
      serviceId,
      completedAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    })
    .where(eq(assessmentSubmissions.id, id));

  await sendCompletionEmails({
    prospectEmail: row.email!,
    locale: row.locale,
    total,
    tier: tier as TierBandId,
    serviceId: serviceId as ServiceId,
    submissionId: id,
  });

  return NextResponse.json({
    id,
    totalScore: total,
    tier,
    serviceId,
  });
}
