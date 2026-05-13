import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";
const TTL = 60 * 60 * 12; // 12h

function secretKey(): Uint8Array | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function createAdminSessionToken(): Promise<string> {
  const key = secretKey();
  if (!key) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 chars)");
  }
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL}s`)
    .sign(key);
}

export async function verifyAdminSessionToken(
  token: string | undefined
): Promise<boolean> {
  const key = secretKey();
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE;
export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TTL,
};
