import { randomUUID } from "crypto";
import { SignJWT, jwtVerify } from "jose";

const CLAIM = "assessment_resume";

function getSecretKey(): Uint8Array | null {
  const s = process.env.RESUME_JWT_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export function createResumeJti(): string {
  return randomUUID();
}

export async function signResumeJwt(args: {
  assessmentId: string;
  jti: string;
  issuedAt: Date;
}): Promise<string> {
  const key = getSecretKey();
  if (!key) {
    throw new Error("RESUME_JWT_SECRET must be set (min 16 chars)");
  }
  const expMs = args.issuedAt.getTime() + 14 * 24 * 60 * 60 * 1000;
  return new SignJWT({ typ: CLAIM, jti: args.jti })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(args.assessmentId)
    .setIssuedAt(Math.floor(args.issuedAt.getTime() / 1000))
    .setExpirationTime(Math.floor(expMs / 1000))
    .sign(key);
}

export async function verifyResumeJwt(token: string | undefined): Promise<{
  assessmentId: string;
  jti: string;
} | null> {
  const key = getSecretKey();
  if (!key || !token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.typ !== CLAIM || typeof payload.jti !== "string") {
      return null;
    }
    const sub = payload.sub;
    if (!sub) return null;
    return { assessmentId: sub, jti: payload.jti };
  } catch {
    return null;
  }
}
