import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assessmentSubmissions } from "@/db/schema";
import { verifyResumeJwt } from "@/lib/assessment/resume-jwt";
import { getDb } from "@/lib/db";
import { clientIp, rateLimitAssessment } from "@/lib/ratelimit";

const patchSchema = z.object({
  token: z.string().min(10),
  answers: z.record(z.string(), z.union([z.string(), z.number()])),
});

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const claims = await verifyResumeJwt(auth);
  if (!claims || claims.assessmentId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  return NextResponse.json({
    id: row.id,
    email: row.email,
    locale: row.locale,
    status: row.status,
    answers: row.answersJson,
    totalScore: row.totalScore,
    tier: row.tier,
    serviceId: row.serviceId,
  });
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const ip = clientIp(request.headers);
  const { success } = await rateLimitAssessment(`patch:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
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
    return NextResponse.json({ error: "Already completed" }, { status: 400 });
  }

  const merged = {
    ...(row.answersJson as Record<string, unknown>),
    ...parsed.data.answers,
  };

  await getDb()
    .update(assessmentSubmissions)
    .set({
      answersJson: merged,
      updatedAt: new Date(),
      lastActivityAt: new Date(),
    })
    .where(eq(assessmentSubmissions.id, id));

  return NextResponse.json({ ok: true, answers: merged });
}
