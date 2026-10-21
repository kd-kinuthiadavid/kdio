import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";

export class AdminAuthError extends Error {
  readonly status = 401;
  constructor() {
    super("Unauthorized");
  }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

/** For server components and layouts: redirects to the login page when not signed in. */
export async function requireAdmin(next?: string): Promise<void> {
  if (await isAdmin()) return;
  const query = next ? `?next=${encodeURIComponent(next)}` : "";
  redirect(`/admin/login${query}`);
}

/** For server actions and route handlers: throws when not signed in. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new AdminAuthError();
}
