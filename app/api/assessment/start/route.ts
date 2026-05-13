import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { assessmentSubmissions } from "@/db/schema";
import { ASSESSMENT_VERSION } from "@/lib/assessment/types";
import { createResumeJti, signResumeJwt } from "@/lib/assessment/resume-jwt";
import { getDb } from "@/lib/db";
import { clientIp, rateLimitAssessment } from "@/lib/ratelimit";

const bodySchema = z.object({
  email: z.string().email(),
  locale: z.string().min(2).max(12),
  consent: z.literal(true),
  utm: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const { success } = await rateLimitAssessment(`start:${ip}`);
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

  const jti = createResumeJti();
  const now = new Date();

  const [row] = await getDb()
    .insert(assessmentSubmissions)
    .values({
      email: parsed.data.email,
      locale: parsed.data.locale,
      status: "draft",
      answersJson: {},
      assessmentVersion: ASSESSMENT_VERSION,
      utmJson: parsed.data.utm ?? null,
      resumeJti: jti,
      lastActivityAt: now,
      updatedAt: now,
    })
    .returning({ id: assessmentSubmissions.id });

  if (!row) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }

  let resumeJwt: string;
  try {
    resumeJwt = await signResumeJwt({
      assessmentId: row.id,
      jti,
      issuedAt: now,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server misconfiguration: RESUME_JWT_SECRET" },
      { status: 503 }
    );
  }

  return NextResponse.json({
    id: row.id,
    resumeToken: resumeJwt,
    resumeParam: resumeJwt,
  });
}
