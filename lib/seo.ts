import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { TRACK_RECORD_ENABLED } from "@/components/shared/nav-links";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export type PublicPath =
  | "/"
  | "/about"
  | "/services"
  | "/method"
  | "/contact"
  | "/assessment"
  | "/work";

/** Indexable routes, shared by the sitemap and page metadata */
export const PUBLIC_PATHS: readonly PublicPath[] = (
  [
    "/",
    "/about",
    "/services",
    "/method",
    "/contact",
    "/assessment",
    "/work",
  ] as const
).filter((path) => path !== "/work" || TRACK_RECORD_ENABLED);

/** Absolute URL of `path` in `locale` */
export function localizedUrl(locale: string, path: PublicPath): string {
  return `${getSiteUrl()}${getPathname({ locale: locale as AppLocale, href: path })}`;
}

/** Served by `app/[locale]/opengraph-image.tsx` */
export function ogImageUrl(locale: string): string {
  return `${getSiteUrl()}/${locale}/opengraph-image`;
}

/** hreflang map for every locale plus `x-default` (the default-locale URL) */
export function localizedAlternates(path: PublicPath): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

type PageMetadataInput = {
  locale: string;
  path: PublicPath;
  title: string;
  description: string;
  /** Use `title` verbatim instead of the layout's title template */
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = localizedUrl(locale, path);
  // A page's `openGraph` replaces the parent's wholesale, so the image must be repeated here.
  const image = {
    url: ogImageUrl(locale),
    width: 1200,
    height: 630,
    alt: `${brand.name} — ${brand.tagline}`,
  };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: localizedAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: brand.name,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

type PageKey = "about" | "services" | "method" | "contact" | "work";

/** Page metadata from the `metadata.pages.<key>` messages */
export async function buildTranslatedPageMetadata(
  locale: string,
  key: PageKey,
  path: PublicPath,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.pages" });
  return buildPageMetadata({
    locale,
    path,
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  });
}
