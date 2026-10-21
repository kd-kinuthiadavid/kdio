import { getDiscoveryCallUrl } from "@/lib/cal";
import { getSiteUrl } from "@/lib/site-url";

/** Where documents and emails send readers. Frozen into a document's snapshot at issue. */
export type PromoLinks = {
  websiteUrl: string;
  bookingUrl: string;
};

function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function getPromoLinks(): PromoLinks {
  const website = process.env.ISSUER_WEBSITE?.trim();
  return {
    websiteUrl: (website ? withProtocol(website) : getSiteUrl()).replace(/\/$/, ""),
    bookingUrl: getDiscoveryCallUrl(),
  };
}

/** "https://www.example.com/a/" -> "example.com/a" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

/** Adds UTM parameters so visits from invoices and emails show up in analytics. */
export function trackedUrl(
  url: string,
  utm: { source: string; medium: "pdf" | "qr" | "email"; campaign?: string | null }
): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", utm.source);
  u.searchParams.set("utm_medium", utm.medium);
  if (utm.campaign) u.searchParams.set("utm_campaign", utm.campaign);
  return u.toString();
}
