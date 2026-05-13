/** Site origin for absolute links in email (no trailing slash) */
export function getSiteUrl(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return u.replace(/\/$/, "");
}
