import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-session";
import { timingSafeStringEqual } from "@/lib/credentials";
import { clientIp, rateLimitAdminLogin } from "@/lib/ratelimit";

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const { success } = await rateLimitAdminLogin(`login:${ip}`);
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

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
  }

  const userOk = timingSafeStringEqual(parsed.data.username, expectedUser);
  const passOk = timingSafeStringEqual(parsed.data.password, expectedPass);
  if (!userOk || !passOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  let token: string;
  try {
    token = await createAdminSessionToken();
  } catch {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);

  return NextResponse.json({ ok: true });
}
