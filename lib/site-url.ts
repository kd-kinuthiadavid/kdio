/** Site origin for absolute URLs in metadata, sitemaps, structured data and email (no trailing slash) */
export function getSiteUrl(): string {
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const u =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000");
  return u.replace(/\/$/, "");
}
